# MG Space - A Responsive Google Images Inspired Accordian

MG Space is a responsive jQuery Google images inspired accordian plugin.

## Getting Started

Basic markup.

```html
    <div class="mg-space-init">
        <div class="mg-rows">
            <div></div>
            <div></div>
            <div></div>
            ...
        </div>
        <div class="mg-targets">
            <div></div>
            <div></div>
            <div></div>
            ...
        </div>        
    </div>
```
In a basic scenario, you just need to import `mg-space.css`, `jquery`, `jquery.mg-space.js` and call the mgSpace() function on the wrapper containing `.mg-rows` and `.mg-targets`.

```html
    <link rel="stylesheet" href="mg-space.css">
    ...
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
    <script src="jquery.mg-space.js"></script>
    <script>
        $(function(){
            $('.mg-space-init').mgSpace();
        });
    </script>
```
## Demo

You can view a few demo examples using mgSpace under the demo folder.

## Licence

Copyright (c) 2011-2012 Bryce Mullican.
Licensed under the MIT license.