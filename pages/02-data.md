---
title: "02 — Data"
prev: "01-data"
next: "03-types"
---

# 02 - Data (2/2)

In the [previous lesson](01-data.html) we have seen that a signle Byte can have
many different representations, but there is only so much we can do with 256 values.

## A Handful of Bytes

### Two Bytes

In decimal, 2-digit numbers give 100 different values (0..99). But if we stack
together two of those, we get a 4-digit number which can represent 10,000 values
(0..9999).

In the same way, if we stack two Bytes together, we don't just double the number
of possible values, we multiply them, giving `65,536` possible values for 8-bits
Bytes.

We will come back to values encoded over two Bytes a bit later, especially when
we look at audio formats.

### A different kind of Word

A Word in computing used to refer to the "default" or "natural" size of the
data for a specific architecture. The processor's favourite type of numbers. So
a Word is not a specific, set number of Bytes. The default size of a unit of
data grew over time, and is often, currently, either 4 Bytes (32 bits) or 8
Bytes (64 bits) for the most common architectures.

```aside> The word "Word" is ambiguous...
The x86 architecture used, a long time ago, a Word that was 2 Bytes long. When
they later doubled that, evolving the architecture to use 4-Bytes-long values
as the natural "default", they decided to keep their old definition of Word as
a 2-Byte-long value, and called the new 4-Bytes values Doubleword (DWORD).
Later, 8-Bytes-long values were introduced as Quadwords (QWORD).

This departure from the original definition of a Word creates ambiguity:
- The traditional definition where it is whichever number of Bytes a CPU
  "prefers"
- Intel's definition (adopted in Windows API too), where it is specifically 2
  Bytes.

To avoid ambiguity, we will prefer starting to call the types by their number
of bits instead.
```

With 4 or 8 Bytes stacked together, the representations still work in the same
way than before, but we have many more values to play with.

### 文字化け

We have discussed [before](#bytes-as-characters) that a single Byte can
represent a character, with ASCII or ASCII-extended conventions. But 256
characters (and actually less than this since some codes are reserved for
Control Codes) is not sufficient in a globalised world. Chinese alone requires
thousands of characters.

That's how Unicode and its infamous UCS-2 encoding came about:
- Unicode is a vast dictionary of characters, where every (mainstream)
  character in the world would be assigned a unique code (Code Point). This
  includes 600+ emojis since 2010. It also leaves plenty of unassigned codes
  for future additions.
- UCS-2 was how it was supposed to be encoded. The idea was simple: 1 Byte is
  not enough, let's use 2 Bytes. 65,536 distinct values, surely that's enough.

Unicode is a great success. UCS-2 was a disaster.

The issue with UCS-2 was that suddenly, every character took two Bytes instead
of the usual 1 Byte. All existing software tried to display it as if each Byte
was a character. Incidentally, most of the alternate Byte was `0` for latin
characters, which was interpreted as a special signal indicating the end of the
text. That broke a lot of existing software.

#### UTF-8
About a year later (1992), [Ken
Thompson](https://en.wikipedia.org/wiki/Ken_Thompson) and [Rob
Pike](https://en.wikipedia.org/wiki/Rob_Pike) invented the **UTF-8** encoding.
UTF-8 stands for Unicode Transformation Format (over 8 bits): it keeps the
Unicode Code Points, but encodes them better. It is the most widely used
character encoding in the world today.

Contrary to UCS-2, UTF-8 is retro-compatible with ASCII. And yet, it can
represent more than a million characters. Way more than UCS-2 could.

How, you ask? With a clever trick.

ASCII only defines the 128 first values, between 0 and 127. So UTF-8 keeps
those unchanged. That's the retro-compatibility. Legacy text in ASCII doesn't
break anymore.

That still leaves plenty of values. ASCII-extended associated these values to a
single character each. UTF-8 uses them as a signal: if the value of a Byte is
greater than 127 (if the top bit is 1), the character is encoded over several
Bytes. Between 2 and 4 Bytes.

- If the Byte is between 0 and 127 (starting with 0 in binary), it is encoded
  over a single Byte, with the same codes as ASCII.
- If the Byte is between 192 and 223 (starting with 110 in binary), it is
  encoded over 2 Bytes.
- If the Byte is between 224 and 239 (starting with 1110 in binary), it is
  encoded over 3 Bytes.
- If the Byte is between 240 and 244 (starting with 11110 in binary), it is
  encoded over 4 Bytes.

You might notice that this leaves the range between 128 and 191
unassigned. That's another clever trick of UTF-8.

After a Byte indicating that a character will be encoded over multiple Bytes,
the following Bytes are called "Continuation Bytes" and taken inside that
128-191 range (starting with 10 in binary). It might feel wasteful, but it is
actually very helpful: it allows to start reading and UTF-8-encoded stream
anywhere without confusion. Or to recover when a character is corrupted.

#### æ–‡å­—åŒ–ã‘

We've all stumbled one day or another on garbled text. It is often called
"Mojibake", from the japanese 文字 (character) and 化け (transformation). It is
what happens when text encoded in one way is read as if it was encoded in a
different way. For instance, when UTF-8 text is interpreted as ISO-8859-1,
characters encoded over multiple bytes will be interpreted as multiple
characters. This is the classic `é` transformed into `Ã©`.

```illus
What about our `163`, then? Well, it is between 128 and 192 (its binary
representation is `10100011` so it starts with `10`). That tells us it is a
continuation Byte. It cannot be a character on its own.

And what character it is will depend on the previous Byte(s).

The simplest case would be that it is part of a 2-Bytes character.
- If the first Byte is 194, then the character is `£`.
- If the first Byte is 195, then the character is `ã`.
- If the first Byte is 201, then the character is `ɣ` (International Phonetic Alphabet).
- If the first Byte is 206, then the character is `Σ` (Greek).
- If the first Byte is 207, then the character is `ϣ` (Coptic).
- If the first Byte is 209, then the character is `ѣ` (Cyrillic).
- If the first Byte is 217, then the character is `٣` (Arabic).
- If the first Byte is 223, then the character is `ߣ` (N'Ko).

But it could also be part of a 3 or 4 Bytes character sequence. The
possibilities are seemingly endless. Here are a few examples:
- `226 163 134` is the character `⣆` (Braille).
- `232 163 131` is the character `裃` (Japanese).
- `224 164 163` is the character `ण` (Hindi Devanagari).
- `240 147 163 128` is the hieroglyph &#x138C0; (as an image <img src="imgs/hiero.svg" style="filter: invert(var(--dark));"/>).
- `240 159 164 163` is the Floor Laughing Emoji 🤣.
``` 

### What does using several Bytes together change?

- For the unsigned integral numbers, the range of representable numbers grows
  (a lot).
  - [0, 4,294,967,295] with 4 Bytes (32 bits).
  - [0, 18,446,744,073,709,551,615] with 8 Bytes (64 bits). (Yes, that's 18 Quintillions.)

- For signed integral,
  - [-2,147,483,648, 2,147,483,647] with 4 Bytes (32 bits),
  - [-9,223,372,036,854,775,808, 9,223,372,036,854,775,807] with 8 Bytes (64 bits).

- A fixed-point number over 4 Bytes (32 bit) can represent values up
  to 20,000 with a 0.000,01 (10<sup>-5</sup>) precision. That's enough to
  measure half the perimeter of the Earth in kilometres while retaining a
  precision at the centimetre.

- Floating-point values also benefit a lot from the additional Bytes.
  - A 32-bit (4 Byte) float can hold 8,388,608 different values per exponent
    band (where our 8-bit representation could only hold 8).
  - It can represent the value 2<sup>-149</sup> which is roughly 1.4&times;10<sup>-45</sup>.
  - It can also represent a value that is about 2.43&times;10<sup>73</sup>.
  - A 64-bit (8 Byte) floating-point number has 4,503,599,627,370,496 values
    per exponent band.
  - It can hold values as small as about 4.94&times;10<sup>-324</sup> and as
    large as about 1.8&times;10<sup>308</sup>.
  - But remember, with floating-point values, the precision scales with the number.
    - For a 32-bit float (4 Bytes), around 10,000,000, the precision is down to
      1 (10,000,001 is representable, but not 10,000,000.5).
    - With 64 bits (8 Bytes), around 10,000,000, the precision remains much
      higher at about 1.86&times;10<sup>-9</sup> (that's roughly 10 nanometre
      precision over the circumference of the Earth).

- Booleans are usually a single Byte, although there are exceptions:
  - Windows API and some other historical APIs (mac-OS) define their own
    boolean type over 4 or 8 Bytes, but it is a distinct type from `bool` (e.g.
    `BOOL`).
  - Some niche architectures use 2, 4, or 8-Byte long booleans (e.g. TI C55x).
  - This doesn't change their basic interpretation: 0 is `false`, anything else is
    `true`.
  - When interpreting multi-byte values as multiple booleans, several Bytes
    means more packed booleans (32 or 64 boolean values at once).

- Characters nowadays use variable length encoding, usually UTF-8, with between
  1 and 4 Bytes per character .

That's a lot of numbers to play with. Mostly, enough for our purpose. But one
reasons we want such enormous ranges of numbers is also that we need room for
calculations. Sometimes we will square, cube, or take an even higher power of a
number. That makes for large values we need to be able to work with.

## Even more Bytes

Eventually, we'll want to express more than just characters or a light
intensity. We will want to express text and images.

### Text

If we keep to our [ASCII](#bytes-as-characters) representation where a single
Byte is a character, a text is simple: it is many Bytes, one after the other,
each representing a different character.

In C++, to make it clear where such a sequence of characters ends, we require
that it ends with a special character: the "null character", sometimes noted
'`\0`' (which has the value `0`).

```illus: Example
So `76`, `105`, `107`, `101`, `32`, `116`, `104`, `97`, `116`, `46`, `0` can
represent the words: "Like that.", complete with a null character at the end.
```

### Image

In a similar way, a sequence of numbers, of Bytes, can be interpreted as an
image. But for an image, we want to keep the value `0` for "completely black",
so we can't use the same trick as the text to know when to stop.

In addition, our image is 2D: it has a width and a height. We will need to know
these if we want to display it properly.

One solution would be to store these two values, as plain integral numbers.

For instance, a [Word](#a-different-kind-of-word) for the Width of the image,
another Word for its height, and then we know that the picture will be made of
*width*&times;*height* [light intensity values](#bytes-as-light-intensity), so we know how many Byte
light-intensity values we expect next.

```illus: Example
Suppose we have an image that is 11 pixels wide, and 8 pixels high.
We could write this:
- `11` (our width)
- `8` (our height)
- `0`, `0`, `255`, `0`, `0`, `0`, `0`, `0`, `255`, `0`, `0`
- `0`, `0`, `0`, `255`, `0`, `0`, `0`, `255`, `0`, `0`, `0`
- `0`, `0`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `0`, `0`
- `0`, `255`, `255`, `128`, `255`, `255`, `255`, `128`, `255`, `255`, `0`
- `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `255`
- `255`, `0`, `255`, `255`, `255`, `255`, `255`, `255`, `255`, `0`, `255`
- `255`, `0`, `255`, `0`, `0`, `0`, `0`, `0`, `255`, `0`, `255`
- `0`, `0`, `0`, `255`, `255`, `0`, `255`, `255`, `0`, `0`, `0`

If our Word size is 4 Bytes (32-bit architecture), that would be 96 Bytes that
we can interpret as an image.
```

```aside> Colour Images...
If we wanted to display a colour image, we could use more Byte values.

Since the human eye can usually detect only 3 distinct elementary colours at
best (colour-blind people might perceive less, and tetrachromat people have a
4<sup>th</sup> one), screen technologies emit 3 distinct colours that we blend
to generate all the colours most people will be able to perceive.

These colours are Red, Green, and Blue. When emitting the 3 together (in the
correct blend), the eye perceives it as white.

So instead of having one picture expressing a light intensity, which would
result in a greyscale image, we can have 3 such images:
- One for the Red light intensity,
- One for the Green light intensity,
- One for the Blue light intensity.

If we want to be able to express a transparency for our image, we can add a
fourth sequence of Bytes, representing that transparency (usually 0 for
transparent and 255 for opaque).

We can either keep these sequences one after the other (no need to repeat the
width and height, they will be the same for each sequence), or interleave them,
with a Byte for the Red, followed by a Byte for the Green, followed by a Byte
for the Blue, and finally a Byte for the transparency. This is often referred to
as RGBA.
```

Let's play with this. Below is a grid of raw Byte values, you can change them
and update the corresponding image.

```gadget
src: gadgets/image-lens.html
height: 700
```

Of course, if we can represent images, we can represent sequences of images:
animations, too. Take a second to consider how many Bytes it takes, though.

### > Sound...

A sequence of values can also express sound. A speaker is essentially a system
where electricity is converted into a magnetic field, which in turn pushes or
pulls a magnet attached to a membrane. The movement of this membrane sets the
surrounding air in motion, and if it makes it vibrate somewhere between 20 times
per second and 20,000 times per seconds, that's sound.

So a series of values, each representing how much to pull or push the magnet,
allows to represent exactly this movement.

There has been several format over time. In some old format, we use an unsigned
8-bit value. `0` means pulling the membrane as far as it goes, and `255` pushing it
as far as it goes the other way, with `128` representing the position where the
membrane is at rest.

Modern formats usually use signed values, often over 16 bits (2 Bytes). The
signed format gives a clearer `0` for leaving the membrane at rest.

```pitfall: Caution
Worth noting that outputting random values to a speaker can damage it. The
membrane is built to oscillate at specific frequencies with specific
intensities. Please be careful if you play with that.
```

## 
```recap: Takeaway
- All a program manipulates is made of numbers, at the core.
- There are many ways to look at these numbers and interpret them.
- A Byte is a number made of at least 8 binary digits (8 bits). It can represent
  256 different values.
  - It is the smallest unit of data the computer works with. 
- A Word is a number usually made of more digits than a Byte. Nowadays usually
  32 or 64 binary digits (32 bits or 64 bits, 4 or 8 Bytes).
- Some representations are straight-forward, others are complicated.
- With enough numbers we can represent any kind of content:
  - Text, Images, Animations, Sound, etc...
```
