Displays pins from a provided Pinterest API response using infinite scroll. Here's a visualization of my approach:

![infinite scroll chart](http://res.cloudinary.com/doilr7vvv/image/upload/v1488758253/infiniteScroll_iqz2j8.png "infinite scroll chart")

Yellow denotes existing items, green items added and red items deleted.

## Features
I implemented the infinite scroll by only rendering a fixed amount of pins at a time.
```javascript
// visibleStart/End denote the indexes of the pins that are visible to the user
const visibleStart = Math.floor(scrollTop / this.props.pinHeight);
const visibleEnd = visibleStart + this.pinsPerPage;

// displayStart/End denote the indexes of the pins rendered which include a buffer in addition to the immediately visible
const displayStart = Math.max(0, visibleStart - this.pinsPerPage);
const displayEnd = displayStart + (4 * this.pinsPerPage);
```

As the user scroll downward, empty space is proportionally added at the bottom causing the effect of a full list of rendered pins.
```javascript
<EmptySpace
  height={(Math.floor(this.props.displayStart / 3)) * this.props.pinHeight * 3}
/>
```

The onScroll event handler was throttled to avoid an overwhelming amount of events.
```javascript
constructor(props){
  ...
  (this:any).scrollState = _.throttle(this.scrollState.bind(this), 100);
}

handleScrollEvent(e: Object) {
  // necesary to persist the synthetic event inorder to throttle
  e.persist();
  this.scrollState(e.target.scrollTop);
}
```

This approach does have the constrain of pins being of fixed and known height.

## Why I didn't use the Pinterest Widget
The Pinterest Widget did not seem to work well with single-page applications. The script does not take into account any DOM manipulation that could change or add pins.

I did find a Pinterest-React component, but I though it was unnecessary. The widget was making request based on the pin id even though all the necessary information was already provided.

## Why React?
This is a simple and short project, so why did I decide to use React?
1. The prompt required the most modular approach possible. React components force modularity.
2. Pinterest has been migrating to React.
3. It's a fun tool I'm comfortable using =).

## Improvements
Given more time, I'd work on the following:

Load Any Board Feature: I would simply use the JS SDK and make some adjustments to handle pagination and differences in data.

Modularity: I originally wrote this project for a single column scroll. It became clear that having multiple columns would be a much more engaging experience for the user. Therefore, I decided to take the risk and sacrifice some of the existing modularity/stability to improve the UI.

Testing: I was excited to use Jest, but did not get to it. I also started using Flow, but could not follow through becuase of time limitations.

Known Bugs:
  1. The Pinterest browser button extension for Chrome makes the images move on hover which becomes really distracting when scrolling
  2. Using "Page Up" or "Page Down" buttons or really fast/erratic scrolling can lead to eccentric behavior. This could be because the listener is throttled.
