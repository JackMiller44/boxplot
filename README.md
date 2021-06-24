# BoxPlot
Custom widget for SAP Analytics Cloud                                         
Authors: Jack Miller, Brandon Kondis, and Matthew Piriya

## Introduction 
This project is a custom widget for SAP Analytics Cloud. This widget will contain a box-and-whisker plot and a builder to initialize it in SAP Analytics Cloud.

## Getting Started
1.	Software dependencies   
    This widget uses the anychart library to construct a box plot. We chose the anychart library because it has good documentation, gives you the ability to customize the design of charts, and was easy to use in our widget code.
2.	Latest releases   
    Version 0.1.0

## Features
### SAP Analytics Cloud Widget
1. The methods available for use in scripts in SAC include

    a. `render(resultSet)` - renders a resultSet passed in from another data source's `getResultSet()` method

    b. `addPlot(name)` - adds a boxplot with name `name` to the chart

    c. `removePlot(name)` - removes a boxplot with name `name` from the chart

    d. `addValue(value, index)` - adds value `value` to chart at index `index`

    e. `removeValue(value, index)` - removes value `value` from chart at index `index`

    f. `addRefPoint(value, index)` - adds reference point with value `value` to chart at index `index`

    g. `removeRefPoint(value, index)` - removes reference point with value `value` from chart at index `index`

    h. `flixAxes()` - flips the x and y axes

    i. `toggleOutliers()` - toggles how outliers are treated in the dataset
    
    *When on, if the data point is less than `Q1 - (1.5 * IQR)` or greater than `Q3 + (1.5 * IQR)` the point is considered an outlier*

    j. `toggleArms()` - toggles whether arms are shown or not

    *When off, only the bar, maximum, and minimum, as well as outliers will show*

2. In the builder panel

    a. The top input field allows for changing of the Chart Title

    b. The Orientation button flips the x and y axes

    c. The Outliers button changes how outliers are represented in a dataset

    d. The Arms button dictates whether the arms will be shown or not

    e. Changing the Reference Points fields add reference points to or remove reference points from each boxplot 
    
    *Ensure to use the format `x,y,z` separating each value by a comma, and using only numeric characters*

3. In the styling panel

    a. The color selector allows the user to change the color of the boxplots

## Build and Test
In order to test this widget in your browser, do the following:

1. Clone this respository

2. You may wish to host the files on your own cloud storage server. If you do, be sure to update boxplot.json with the appropriate links

3. In SAP Analytics Cloud -> Analytics Applications, go to Add Custom Widget and select the boxplot.json file

4. Create a new (or open existing) Analytics Application. Inside, insert the table of data you want to visualize with the boxplot widget, and the boxplot widget itself

5. Insert the boxplot widget

6. In Canvas -> fx -> onInitialization, paste the following code:
        `var resultSet = Table_1.getDataSource().getResultSet();
        console.log(resultSet);
        boxplot_1.render(resultSet);`
        
7. Make whatever adjustments you want to the builder/styling panel, save changes, and Run Analytics Application
