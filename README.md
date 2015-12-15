# ws2811

For when you want to power an awful lot of LEDs.

## Setup

The BeagleBones are configured via ansible. You can download a minimal debian BeagleBone image from [here](http://elinux.org/Beagleboard:BeagleBoneBlack_Debian). Login and ensure python is installed:

```sh
sudo apt-get update
sudo apt-get install python
```

After that, Ansible can take care of the rest:

```sh
ansible-playbook -i ansible/inventories/local.ini ansible/main.yml
```

NOTE: The Bone's builtin eMMC isn't very fast, so some tasks can take a considerable amount of time. Have a cup of coffee (or two) before deciding it's actually stalled/broken.

### Layout

Physical device pins on which to output data; this results in a contiguous memory map where each pin is driven by a block of memory that corresponds to that pin's pixel count. The keys correspond to the pin header mappings for the BeagleBone Black.

```js
{
  pins: {
    'P9_22': 300,
    'P9_24': 50
  }
}
```

### Channel

Logical groupings of the physical pixel layout into something meaningful. One pin may power several logical groups of pixels, so animating them is easier if they can be referred to by something sensible.

```js
{
  id: 'rooftop',
  pixels: [{
    group: 'P9_22', // entry in layout pins
    offset: 10, // offset in string
    length: 25 // pixels after offset to use
  }]
}
```

### Sequence

```js
{
  events: [{
    timestamp: 0, // time at which to perform the action
    channel: 'rooftop', // channel on which to perform the action
    action: {
      type: 'set',
      duration: 1000
    }
  }]
}
```
