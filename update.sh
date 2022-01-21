#!/bin/sh
set -e
git reset --hard
ssh-agent bash -c 'ssh-add /root/.ssh/id_rsa_gh; git pull'
npm i
npm run build
pm2 restart og-img