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
