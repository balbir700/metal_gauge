**AI PREDICTION MODEL DOCUMENTATION**
**Step 1: Data Acquisition**



Accurate and reliable data acquisition forms the foundation of the proposed AI model. The system integrates multiple data sources to ensure comprehensive coverage of parameters influencing Heavy Metal Pollution Indices (HEI, HPI, etc.).





**1 A. CSV Dataset Parameters**



The primary dataset will be collected in CSV format, containing structured tabular data. Each row represents a monitoring point with the following attributes:

* Latitude (lat): Geographic coordinate for sampling location.
* Longitude (long): Geographic coordinate for sampling location.
* River HPI (riverhpi): Heavy Metal Pollution Index of the river at the given point.
* Industrial Load (industrial_load): Quantitative estimate of industrial discharge load influencing water quality.
* Land Use (land_use): Classification of surrounding land use (agricultural, industrial, residential, forest, etc.).
* Electrical Conductivity (ec): Indicator of dissolved salts and pollutants in water.
* Total Dissolved Solids (tds): Measure of organic and inorganic substances present in water.
* Neighbourhood HPI Mean (hpi_neighbour_mean): Average HPI value of nearby monitoring stations to capture spatial correlations.
* Distance to River (distance_to_river): Euclidean distance of sampling location or industrial site to the nearest river segment.
* This structured dataset will serve as the input features for the XGBoost prediction model.





**1 B. GeoJSON File Integration**



To enrich the dataset with spatial and geospatial context, the system incorporates GeoJSON files containing geographical and environmental information:

* Factory Locations: Geospatial coordinates of industrial units contributing to heavy metal discharge.
* River Network: Geographical representation of rivers and tributaries under study.
* Electrical Conductivity (EC) Data: Spatial distribution of EC across different river segments.
* Total Dissolved Solids (TDS) Data: Georeferenced TDS measurements to understand spatial variations.



The GeoJSON layer enables:

* Spatial correlation of industrial sites with pollution indices.
* Visualization of pollution hotspots along river stretches.
* Integration of geospatial features into the AI model for enhanced predictive capability.







**Step 2: Model Initialization**



Once the dataset is acquired, the next step is to set up the environment for model development. This includes importing the required libraries, loading the dataset, and preparing it for further preprocessing.



**2 A. Importing Essential Libraries**



The following Python libraries are utilized for data handling, model development, and geospatial visualization:

* NumPy: For numerical operations and array manipulations.
* Pandas: For data loading, cleaning, and tabular operations.
* Scikit-learn (sklearn): For preprocessing, evaluation metrics, and utilities supporting machine learning workflows.
* XGBoost: Core machine learning algorithm used for predicting Heavy Metal Pollution Indices.
* Joblib: For model saving and loading, ensuring reusability without retraining.
* Branca.colormap: For creating customized colormaps in visualization outputs.
* Folium: For interactive geospatial visualizations on maps.
* Shapely: For geometric operations on geospatial data (e.g., calculating distances, intersections).





**2 B. Opening the CSV Dataset**



The acquired CSV dataset (from previous step) is loaded into the environment using Pandas for further processing.







**Step 3: Testing and Training**



After loading the dataset, the next step is to divide the data into training and testing sets. This ensures that the model is trained on a majority of the data while keeping a separate portion aside to evaluate its performance on unseen data.

Data Splitting Strategy

* Training Set (80%) → Used to train the XGBoost model.
* Testing Set (20%) → Used to validate and test the model’s predictive performance.

This 80:20 ratio is chosen to maintain a balance between sufficient training data and reliable testing results.






**Step 4: XGBoost Regression**



XGBoost is a gradient boosting framework that builds decision trees in sequence to improve predictions. It focuses on correcting errors from previous trees, making it highly effective for regression tasks.





**Step 5: Accuracy Testing**



To measure how well the XGBoost regression model performs, the R² Score (Coefficient of Determination) is used. It evaluates the proportion of variance in the target variable that is predictable from the input features.



Key Points

* R² Score = 1.0 → Perfect prediction.
* R² Score close to 0 → Model fails to explain variability.
* The score is computed by comparing y\_test (actual values) with y\_pred (model predictions) using the test dataset.








**Step 6: Predicting Values for Heatmap**





**6 A. Importing the Model**



Once the XGBoost model is trained and evaluated, it is saved and later re-used for generating predictions without retraining. Importing the model ensures efficiency and consistency when applying it to new data.


![Image for 6A](/images/step6-sub1.jpg)


**6 B. Loading GeoJSON and Input File**



The GeoJSON file provides spatial data (factories, river locations, EC, TDS, etc.), while the CSV input file contains feature values for prediction. These files are merged to provide both geospatial context and predictive features.



The combination of tabular (CSV) and spatial (GeoJSON) data ensures predictions are tied to real-world coordinates, enabling mapping and visualization of pollution levels.

![Image for 6B](/images/step6-sub2.jpg)





**Step 7: Making Buffer Zones**





**7 A. Creating a Grid**



A 10×10 km grid is generated, divided into 1 km² blocks. A representative point (centroid) is selected in each block, and predictions are made for that location using the trained model.



This grid-based sampling allows spatial predictions of HPI, ensuring pollution can be visualized across an area, not just at monitoring points

![Image for 7A](/images/step7-sub1.jpg)



**7 B. Assigning Features**



Each grid point is enriched with attributes from the GeoJSON (e.g., distance to river, EC, TDS). This provides the required input features for the prediction model


Linking geospatial features ensures predictions are context-aware, reflecting both environmental and industrial influences

![Image for 7B](/images/step7-sub2.jpg)



**7 C. Passing Features**



The enriched features are passed into the XGBoost model to predict HPI for each grid point.



&nbsp;By passing these prepared features into the model, we generate pollution index predictions for every location in the grid.


![Image for 7C](/images/step7-sub3.jpg)






**7 D. Output Storage**



Predicted HPI values are stored back into a GeoJSON file, which can then be visualized as a heatmap.



Storing outputs in GeoJSON makes the results compatible with GIS tools, enabling interactive maps and pollution heatmaps.

![Image for 7D](/images/step7-sub4.jpg)








**Step 8: Plotting the Heatmap**





**8 A. Loading the Predicted GeoJSON File**



The predicted GeoJSON file, which contains the HPI values for each location, is loaded for visualization.



Loading the predicted data into a geospatial format ensures it can be directly mapped and used in visualization tools like Folium.

![Image for 8A](/images/step8-sub1.jpg)






**8 B. Converting Points to 1×1 km Blocks**



Each predicted point is expanded into a 1 km² polygon to represent the spatial extent of the prediction.



&nbsp;Instead of just visualizing single points, converting to blocks gives a continuous spatial distribution, making the heatmap more realistic.

![Image for 8B](/images/step8-sub2.jpg)





**8 C. Passing to Folium**



The centroids of each block are used to plot on a Folium map, which is interactive and web-based.



Folium requires latitude-longitude values. By finding centroids, the map is anchored and predictions are positioned correctly.

![Image for 8C](/images/step8-sub3.jpg)






**8 D. Color Mapping**



A colormap is applied to represent low-to-high HPI values with distinct colors.



Color mapping makes it easy to identify pollution intensity visually — lighter shades for low HPI, darker shades for high HPI.

![Image for 8D](/images/step8-sub4.jpg)






**8 E. Generation of HTML File**



The complete Folium map with color-coded blocks is exported as an interactive HTML file.



Exporting the results as an HTML file allows users to explore the heatmap interactively, zoom into regions, and analyze pollution hotspots without requiring specialized GIS software.

![Image for 8E](/images/step8-sub5.jpg)


