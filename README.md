# Open Graph Image Generator

Webservice that generates Open Graph images for your websites.

## What is Open Graph image ?

Open Graph image is a small image that is used to represent your website in social media.
It is used to share your website on Facebook, Twitter, Google+, Pinterest, LinkedIn, etc.

Here is an example: 

![open graph image generator sample in tweet](.github/img/opengraph-image-generator.png)


## Use our service

You can use our service to generate Open Graph images for your websites.

Just add those tags on your HTML pages:

```html
<meta property="og:image" content="https://og-img.ld83.com/img/<text>/<footer>" />
<meta name="twitter:image" content="https://og-img.ld83.com/img/<text>/<footer>" />
```

With:
- `<text>`: your text encoded in base64
- `<footer>`: your footer encoded in base64

Example:

```bash
https://og-img.ld83.com/img/Q29ubmV4aW9uIFNTTCDDoCBQb3N0Z3JlU1FMIGRlcHVpcyBOb2RlanM=/aHR0cHM6Ly9kcHAuc3QvYmxvZy9ub2RlanMtcG9zdGdyZXNxbC1zc2wtY29ubmV4aW9uLw==
```
Will produce this image:

![open graph image generator sample image](https://og-img.ld83.com/img/Q29ubmV4aW9uIFNTTCDDoCBQb3N0Z3JlU1FMIGRlcHVpcyBOb2RlanM=/aHR0cHM6Ly9kcHAuc3QvYmxvZy9ub2RlanMtcG9zdGdyZXNxbC1zc2wtY29ubmV4aW9uLw==)


## Host your own open graph image generator as a service

If tou want to host your own service, you need a Node.js server available on the internet.

And:

```shell
git clone git@github.com:toorop/og-image.git
npm install
node app.js
```

We highly recommend to use [Cloudflare](https://www.cloudflare.com/) to proxy/cache your service.

## Docker (experimental)  

1. Build the image
```shell
npm run docker:build
```

2. Run the image (change the 4444 port at your convenience)
```shell
docker run -p 4444:3333 -d toorop/og-image
```

