
#define GPIO0 0x44E07000
#define GPIO1 0x4804C000
#define GPIO2 0x481AC000
#define GPIO3 0x481AE000

#define GPIO_CLEARDATAOUT 0x190
#define GPIO_SETDATAOUT 0x194
#define CONTROL 0x22000

// Determine maximum number of pixels that can be processed
// running at 60 fps
// 1250 * n + 50000 = 1 / fps
// n = (1 / fps * 1e9 + 50000) / 1250
#define FPS 60
#define MAX_PIXEL_COUNT (1 / FPS * 1e9 + 50000) / 1250

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

WAIT:

	// Load in configuration data into the first few registers.
	// r0 -> Address of the pixel data (somewhere in L3 DDR)
	// This address can change in order to provide double-buffering
	// to the client by alternating between front/back buffer.
	// r1 -> Number of pixels; this represents a pixel data length of number
	// of pixels * 4 since every pixel takes 4 bytes.

	// 0 is the address of configuration data relative to PRU memory
	MOV  r0, 0

	// Overwrite r0, r1 with actual data
	// Note: 8 bytes = 2 full registers worth of data
	LBBO &r0, r0, 0, 8

	// Put the base address of the pixels into r10
	MOV r10, r0
	// Put the number of pixels from configuration into r11
	MOV r11, r2
	// Multiply the number of pixels by 4
	LSL r11, r11, 2
	// Add the base address to it to get the last address
	ADD r11, r11, r10

BITS:
	// There are 32 bits in a pixel-word packed as RGBA.
	MOV r6, 32

	// Start loading the pixel data into memory; r12 is the pixel-word.
	LBBO r12, r10, 0, 4

	BIT:
		// Flow from left to right, so this means we start work on bit 31
		// first (since r6 starts with 32)
		SUB r6, r6, 1

		// Set the output pin
		MOV r20, 0x8004

		// Clear the current output
		MOV r13, 0
		QBBS NEXT, r12, r6
		MOV r13, 0x8004
		NEXT:

		MOV r18, GPIO0 | GPIO_SETDATAOUT

		TIMECONTROL

		// wait until T0 has passed (@0ns) and
		// set all pins to high
		SBBO r20, r18, 0, 4


		MOV r18, GPIO0 | GPIO_CLEARDATAOUT

		// wait until T0H has passed (@250ns)
		// if data is 0 then clear the pin
		AT 250, _T0H
		SBBO r13, r18, 0, 4

		// wait until T1H has passed (@600ns)
		// clear the pin
		AT 600, _T1H
		SBBO r20, r18, 0, 4

		// wait until TOL has passed (@1250ns)
		// proceed to the next bit
		// shave off 10ns for the ADD/QBGT
		// instructions below
		AT 1240, _TOL
		QBNE BIT, r6, 8

	// Increase the address base so that the next batch of pixels get done
	ADD r10, r10, 4

	// If we've not processed all the pixels go back and process the next
	QBGT BITS, r10, r11

// Reset the clock
TIMECONTROL
// Wait for 50ms to strobe the next line of data to all pixels
AT 50000, _TRES

// Process the next set of data
QBA WAIT
