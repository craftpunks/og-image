FROM node:16

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      libxss1 libx11-6 libx11-xcb1 libxcb1 libxcb-dri3-0 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
      fonts-noto-color-emoji --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /usr/local/share/fonts \
    && cp /usr/share/fonts/truetype/noto/NotoColorEmoji.ttf /usr/local/share/fonts/ \
    && chmod 644 /usr/local/share/fonts/NotoColorEmoji.ttf \
    && fc-cache -fv

# If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# uncomment the following lines to have `dumb-init` as PID 1
# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init
# ENTRYPOINT ["dumb-init", "--"]

# Uncomment to skip the chromium download when installing puppeteer. If you do,
# you'll need to launch puppeteer with:
#     browser.launch({executablePath: 'google-chrome-stable'})
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Create app directory
WORKDIR /usr/src/app

# Add user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser

# Install app dependencies
COPY --chown=pptruser:pptruser package*.json ./

# If you are building your code for production (RUN npm ci --only=production)
RUN npm install

# Install puppeteer so it's available in the container.
# Add user so we don't need --no-sandbox.
# same layer as npm install to keep re-chowned files from using up several hundred MBs more space
RUN mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src/app

# Bundle app source
COPY --chown=pptruser:pptruser . .

EXPOSE 3333

# Run everything after as non-privileged user.
USER pptruser

CMD [ "node", "app.js", "--docker"]
