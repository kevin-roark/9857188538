dark-t-m-f
==========

*d t m f // d t m f // d t m f // d t m f*

## input format:

[RATIO - <WHITESPACE TO SOUND RATIO>] (default 0.44)
[DISTORT - <LEVEL OF DISTORTION TO APPLY>] (default 0.15)

`<line one of words -> don't be an idiot>, <onset -> seconds>, <duration -> seconds>, <ampltude -> 0.0 - 1.0>`

`<line two of words -> don't be an idiot>, <onset -> seconds>, <duration -> seconds>, <ampltude -> 0.0 - 1.0>`

`...`

if you use any character that isn't a letter, a number, *, +, or #, you will
break my program. go away.

## input nice things:

optional 5th comma-separated component of the whitespace ratio for that
particular line.

use `+x` for onset where `x` is time to add from the previous line's onset


## requirements:

sox with mp3 capability
interneb
