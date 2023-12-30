# tank_node
Controlling the adeept rasptank with node

## Ideas

The browser (sometimes?) refuses to read data from non HTTPS addresses.

One option would be to set up an openSSL CA and import its root certificate into the browser as trustworthy.

Another option would be a setup  like this:
 * The raspi implements an access point, DHCP and DNS server, so it could be an isolated island network
 * The DNS server can map internal IP addresses to DNS addresses for which I can create let's encrypt certificates
 * Problem: certificates have to be created on another computer (with internet access) and transferred to the rasptank regularly

This way, the rasptank and some other WLAN enabled device (like a smartphone or a steamdeck) are the only things needed to control the rasptank. 
If the tank goes out of range, you just have to go nearer yourself. Somehow the old RC model planes feeling... :-)

