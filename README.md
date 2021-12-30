# Emergent Algorithms

[![contributors](https://img.shields.io/github/contributors/patrick-mahnkopf/emergent-algorithms)](https://github.com/patrick-mahnkopf/emergent-algorithms/graphs/contributors)
[![forks](https://img.shields.io/github/forks/patrick-mahnkopf/emergent-algorithms)](https://github.com/patrick-mahnkopf/emergent-algorithms/network/members)
[![stars](https://img.shields.io/github/stars/patrick-mahnkopf/emergent-algorithms)](https://github.com/patrick-mahnkopf/emergent-algorithms/stargazers)
[![license](https://img.shields.io/github/license/patrick-mahnkopf/emergent-algorithms)](./LICENSE.txt)
[![issues](https://img.shields.io/github/issues/patrick-mahnkopf/emergent-algorithms)](https://github.com/patrick-mahnkopf/emergent-algorithms/issues)

This repository contains interactive simulations of emergent behavior running directly in the browser, rendered using PixiJS.  
Try the [live demo](https://patrick-mahnkopf.github.io/emergent-algorithms/) or run the project locally using Angular.

## Emergent Behavior

### What is emergent behavior?

Emergent behavior is the result of many small entities working with a simple ruleset to create something that's larger than the sum of its parts.
Each agent in these simulations acts on a very simple ruleset and can not do much on its own.
When it interacts with the other agents however, new properties and behaviors emerge which were not part of either agent before.
This phenomenon is so common that it might even be what combines the building blocks of nature into the very reality we perceive.

### Where does emergent behavior occur?

We can observe emergence in nonliving physical systems like the ripple patterns forming in sand dunes, water crystals forming into snow flakes, and even in the very fabric of space and time that governs our existence, since the laws of physics themselves likely stem from emergent behavior.
This in turn might mean that chemistry is an emergent property of the laws of physics, and biology one of the laws of chemistry.
The simulations here will focus on biological and social effects of emergence in the form of swarming behavior as observed in schooling fish, and flocking birds among others, as well as the foraging behavior of ant colonies.

![boids](https://user-images.githubusercontent.com/69430023/147598153-c43067e8-c33a-46c4-ad69-c952e0e37f17.gif)

## Development Setup

### Prerequisites

- Install [Node.js](https://nodejs.org/) which includes [Node Package Manager](https://www.npmjs.com/get-npm)
- Install the Angular CLI globally:

```
npm install -g @angular/cli
```

- Clone the repository:

```
git clone https://github.com/patrick-mahnkopf/emergent-algorithms.git
```

- Run the Application:

```
cd emergent-algorithms
ng serve --open
```
