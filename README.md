# Javascript Calculator

[![N|Solid](http://dev.tomeralmog.com/calculator/assets/images/calc.png)](http://dev.tomeralmog.com/calculator/)

An object oriented implementation of a simple calculator using JavaScript. You can use the calculator via keyboard or clicking the buttons.

## [Click for live example](http://dev.tomeralmog.com/calculator/)


In this project I focused on
* Design - simple UX, all css (no images)
* Object Oriented Architecture - Calculator is an object with private methods
* Easy to maintain - Separation of concerns: object for display, object for capturing the input, object for the calculator itself and a setting object to control the global settings.

### Tech

I used grunt to automate dev process, minify the code and compile scss into css.

### Installation

Download and extract the [repo](https://github.com/tomeralmog/calculator-js).

Install the dependencies and devDependencies.

```sh
$ npm install
$ bower install
```

To Run the Code:

```sh
$ grunt serve
```

To build:

```sh
$ grunt
```
### Created by

[![N|Solid](http://tomeralmog.com/themes/tomer/images/baloon-girl.png)](http://www.tomeralmog.com)

Tomer Almog

[tomeralmog.com](http://www.tomeralmog.com)
