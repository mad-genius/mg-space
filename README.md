# MG Space - A Responsive Google Images Inspired Accordian

MG Space is a responsive jQuery Google images inspired accordian plugin.

## Getting Started

Basic markup.

```html
    <div class="mg-space-init">
        <div class="mg-rows">
            <div class="mg-row"></div>
            <div class="mg-row"></div>
            <div class="mg-row"></div>
            ...
        </div>
        <div class="mg-targets">
            <div class="mg-target"></div>
            <div class="mg-target"></div>
            <div class="mg-target"></div>
            ...
        </div>        
    </div>
```
In a basic scenario, you just need to import `jquery`, `jquery.mg-space.js` and call the mgSpace() function on the wrapper containing `.mg-rows` and `.mg-targets`.

```html
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
    <script src="js/jquery.mg-space.js"></script>
    <script>
        $(function(){
            $('.mg-space-init').mgSpace();
        });
    </script>
```
## Demo

You can view a few demo examples using mgSpace [here](https://github.com/Bryce-Mullican//tree/develop/demo)

## Licence

Copyright (c) 2011-2012 Bryce Mullican
Licensed under the MIT license.
(https://github.com/Bryce-Mullican//blob/master/MIT-LICENSE.txt)