#!/bin/sh
set -e
git reset --hard
ssh-agent bash -c 'ssh-add /root/.ssh/id_rsa_gh; git pull'
npm i
pm2 restart og-img