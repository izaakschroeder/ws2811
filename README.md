# ws2811

For when you want to power an awful lot of LEDs.

TODO:
 * [ ] Timers (on/off at certain times)
 * [ ] Ansible install / configure cape-universal on boot
 * [ ] Actually run appropriate babel commands
 * [ ] Better animation

Features:
 * Multiple buffering
 * Audio output

## Setup

The BeagleBones are configured via ansible. You can download a minimal debian BeagleBone image from [here](http://elinux.org/Beagleboard:BeagleBoneBlack_Debian). Login to each BeagleBone and ensure python is installed:

```sh
sudo apt-get update
sudo apt-get install -y python
```

Configure the addresses and logins of your BeagleBones in the inventory file:

```ini
beaglebone-1
beaglebone-2

[all:vars]
ansible_user=debian
```

After that, Ansible can take care of the rest:

```sh
ansible-playbook -i ansible/inventories/local.ini ansible/main.yml
```

Once installed you'll have an HTTP API available to query and control the LEDs with.

```sh
curl http://beaglebone-1:8080/
```

NOTE: The BeagleBone's builtin eMMC isn't very fast, so some tasks can take a considerable amount of time. Have a cup of coffee (or two) before deciding it's actually stalled/broken.

## API

### Pins

Physical device pins on which to output data; this results in a contiguous memory map where each pin is driven by a block of memory that corresponds to that pin's pixel count. The keys correspond to the pin header mappings for the BeagleBone Black.

`GET /pins` Fetch a list of pins
```json
{
  "P9_22": {
    "enabled": false,
    "key": "P9_22",
    "length": null,
    "state": null,
  },
  "P9_24": {
    "enabled": true,
    "key": "P9_24",
    "length": 5,
    "state": [ 0, 0, 0, 0, 0 ],
  }
}
```

`PATCH /pins/P9_24` Enable a single pin
```json
{
  "enabled": true,
  "length": 5,
}
```

`PATCH /pins/P9_24` Write pixel data to a pin
```json
{
  "state": [
    65280,
    16711680,
    4278190080,
  ]
}
```

### Sequence

```js
{
  events: [{
    // Time at which to perform the action. This time is relative to the start
    // of the sequence and is in milliseconds.
    timestamp: 0,
    // Target on which to perform the action.
    target: {
      pin: 'P9_24',
      offset: 0,
      length: 25,
    },
    action: {
      type: 'set',
      duration: 1000
    }
  }]
}
```

## Notes
 * shairport-sync / ALSA eats about ~10% CPU when streaming
 * jinja2 has stupid scoping http://stackoverflow.com/questions/21489665
