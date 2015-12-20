

#define GPIO_CLEARDATAOUT 0x190
#define GPIO_SETDATAOUT 0x194
#define CONTROL 0x22000

.macro TIMECONTROL
	MOV r8, CONTROL // control register
	LBBO r9, r8, 0, 4
	CLR r9, r9, 3 // disable counter bit
	SBBO r9, r8, 0, 4 // write it back
	MOV r10, 0
	SBBO r10, r8, 0xC, 4 // clear the timer
	SET r9, r9, 3 // enable counter bit
	SBBO r9, r8, 0, 4 // write it back
.endm

.macro AT
.mparam ns,lab
    MOV r8, CONTROL
    MOV r7, (ns)/5
lab:
	LBBO r9, r8, 0xC, 4
	QBGT lab, r9, r7
.endm

.origin 0
.entrypoint START

START:
	// Load r0 with the address where all the descriptors reside
	MOV  r0, 0
	// Put these constants in registers since they are large
	MOV r21, GPIO_SETDATAOUT
	MOV r22, GPIO_CLEARDATAOUT

  // Read the header (r14 = number of layout entries, r15 = buffer offset)
  LBBO &r14, r0, 0, 8

  // Start reading layout data after the header
  ADD r0, r0, 8
LIST:
  // if len is 0 then we've reached terminal list
  QBEQ DONE, r14, 0
  // We've processed one entry
  SUB r14, r14, 1
	// copy 4 ints to r1, r2, r3, r4 (port, mask, address, length)
	LBBO &r1, r0, 0, 16

  // add the buffer offset to the address
  ADD r3, r3, r15

	// Multiply length by 4 to get length in bytes
	LSL r4, r4, 2
	// Calculate last address as r5
	ADD r4, r4, r3

	PIXEL:
		// Read pixel data into r11
		LBBO &r11, r3, 0, 4
		//MOV r11, 0xFF00FF00
		// Start processing at bit 32
		MOV r6, 32

		BIT:
			// Target the SET data out pin first
			ADD r18, r2, r21
			TIMECONTROL
			//wait until T0 has passed (@0ns) and
			SBBO r5, r18, 0, 4
			// And then the CLEAR data out pin
			ADD r18, r2, r22

			SUB r6, r6, 1
			MOV r13, 0
      QBBS NEXT, r11, r6
      MOV r13, r5
      NEXT:

			//wait until T0H has passed (@250ns)
			//if data is 0 then clear the pin
			AT 250, _T0H
			SBBO r13, r18, 0, 4
			AT 600, _T1H
			SBBO r3, r18, 0, 4
			AT 1250, _TOL
			// Continue processing until all the bits in the pixel
			// is complete; note that this is 8 instead of 0 because
			// the alpha channel can be safely ignored.
			QBNE BIT, r6, 8

		// Increment the address of current pixel data by 4 to get the
		// data of the next pixel
		ADD r3, r3, 4
		// Keep processing if we have not yet reached the last pixel
		QBLT PIXEL, r4, r3


	// Continue list processing
	QBA LIST


DONE:
HALT
