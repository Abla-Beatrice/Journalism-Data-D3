# Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Background

I analyzed the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help readers understand my findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. I am sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). The current data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."


![4-scatter](Codes/Images/4-scatter.jpg)

* Created a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

* Included state abbreviations in the circles.

* Created and situated axes and labels to the left and bottom of the chart.

- - -

Why make a static graphic when D3 lets you interact with the data?

![7-animated-scatter](Codes/Images/7-animated-scatter.gif)

#### 1. More Data, More Dynamics

Included more demographics and more risk factors. 
Placed additional labels in scatter plot and gived them click events so that users can decide which data to display. 
Animated the transitions for circles' locations as well as the range of axes. 

#### 2. Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. 
Add tooltips to y]circles and display each tooltip with the data that the user has selected. 
Use the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged).

![8-tooltip](Codes/Images/8-tooltip.gif)
