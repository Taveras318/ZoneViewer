# ZoneViewer
The Districting Office at the Department of Education often wants to examine how changing the perimeter of a school zone will effect the percentage of students within that zone that are eligible for transportation.
Eligibility is determined by a combination of a student's distance from their school and their grade.Students that are within 2640 feet or 1/2 a mile of their school are considered able to walk and are not eligible for transportation.
An "Ideal Zone" is considered one in which all students are eligible to walk to their zoned school, the closer to this situation the better in terms of cost for the Department of Education.
In order to aid the Districting Office in their analysis of changing zones and the effect on transportation eligibility, and analyst on the BI GIS Team at the Office of Pupil Transportation(Me), created a tool using to be used in ArcMap.In order to use this tool the user should have a working knowledge of GIS and the ESRI software. The ZONEVIEWER, application allows users with no knowledge of GIS or any additional software to gain the same insight.
ZONEVIEWER only pertains to elementary schools in the borough of Manhattan.

# Functionalities
## View school locations and their zone polygons

The initial view of the web page is a map displaying elementary schools and the zone polygons. When the user hovers over a school point, the school 'ATS Code' or 'DBN' as well as the School name are displayed in a pop up. Simultaneously the zone that is assigned to that school is highlighted. Both the school points and the zone polygons are geoJSON files added using jquery.

## View areas that are not eligible for transportation

Upon clicking on a school location, the map zooms into the school's zone and displays the area that is not eligible for transportation. This area is a service area polygon generated in ArcMap using the TED Network. The TED Network is comprised of only those segments within lion that are considered safe for students to work on. Each area is 2640 feet from the school.The layer is added to the controls and can be turned on and off.

## Create new polygon to represent a proposed zone

By clicking on the button 'Click to draw proposed zone polygon', the user enables the polygon draw control. In order to start a drawing the user has to click on the pentagon icon. The user clicks on the map wherever they would like a vertex and then click on their first point and 'Finish' in order to close the polygon. When 'Finish' is clicked, the drawn polygon is displayed on the map and the map zooms into the boundary of that polygon.

## Upload a csv of students

In order to enable the upload of a csv, the user must click the button 'Click to drag and drop a csv of student locations'.

## Clear map

The 'Click to clear proposed polygon' button, removes the newly created polygon from the map and resets the view to the initial view in order for the user to be able to repeat the process for a different school.

# Libraries
* leaflet 
* jquery
* dojo

# Authors
* **Shantal Taveras** 

## Acknowledgements 
* Gordon Green -'Draw Controls'
* Joanna Laroussi -'loadCSV'


