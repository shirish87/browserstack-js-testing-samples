#!/bin/bash -e

wget http://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
unzip BrowserStackLocal-linux-x64.zip

echo "Starting: BrowserStackLocal <access-key> $@"
./BrowserStackLocal ${BROWSERSTACK_KEY} $@ > /dev/null &
sleep 10

