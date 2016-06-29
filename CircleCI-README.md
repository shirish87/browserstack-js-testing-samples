# BrowserStack Local on CircleCI

```yaml
test:
  override:
    # Starts BrowserStack Local with the supplied arguments
    - ./run_local.bash -localIdentifier 123

  post:
    # Terminates all instances of BrowserStack Local
    - killall -15 BrowserStackLocal
```

## Bash Script: run_local.bash

```
# Download BrowserStackLocal for Linux
wget http://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip

# Unzip to current location
unzip BrowserStackLocal-linux-x64.zip

# Execute with access key from environment variable and supplied arguments
echo "Starting: BrowserStackLocal <access-key> $@"
./BrowserStackLocal ${BROWSERSTACK_KEY} $@ > /dev/null &

# Sleep a few seconds to wait for connections to be set up
sleep 10

```
