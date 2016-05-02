# MG Space - A Responsive Google Images Inspired Accordion

MG Space is a responsive jQuery Google images inspired accordion plugin. <a href="http://mad-genius.github.io/mg-space/">http://mad-genius.github.io/mg-space/</a>

## Getting Started

Basic markup.

```html
    <div class="mg-space-init">
        <div class="mg-rows">
            <div>
                <a href="#" title="trigger element" class="mg-trigger"></a>
            </div>
            <div>
                <a href="#" title="trigger element" class="mg-trigger"></a>
            </div>
            <div>
                <a href="#" title="trigger element" class="mg-trigger"></a>
            </div>
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
In a basic scenario, you just need to import `mg-space.css`, `jquery`, `jquery.mg-space.js` and call the mgSpace() function on the wrapper containing `.mg-rows` and `.mg-targets`. The trigger `mg-trigger` does not have to be a link, but it does have to be inside a child of `.mg-rows` as shown.

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

You can view a few demo examples using mgSpace [here](http://mad-genius.github.io/mg-space/).

## Licence

Copyright (c) 2011-2012 Bryce Mullican.
Licensed under the MIT license.
(https://github.com/Mad-Genius/mg-space/blob/master/MIT-LICENSE.txt)