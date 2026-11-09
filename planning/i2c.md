Adafruit_MCP4728::setChannelValue()




i2c_dev->write(output_buffer, 3)

so we write to i2c with a buffer size of length 3. Presumably thats bytes?

The write command is defined by using
three write command type bits (C2, C1, C0) and two
write function bits (W1, W0). The register selection bits
(DAC1, DAC0) are used to select the DAC ch


communication is initiated by the master (MCU) which
sends the START bit, followed by the slave (MCP4728)
address byte. The first byte transmitted is always the
slave (MCP4728) address byte, which contains the
device code (1100), the address bits (A2, A1, A0), and
the R/W bit. The device code for the MCP4728 device
is 1100, and the address bits are user-writable.

ok so the first byte really should be 0110 0000
which is start bit + device code +  default address bits
which is 0x60 
this is exactly the value we see in the code for MCP4728_I2CADDR_DEFAULT