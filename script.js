
$(document).ready(function () {
    $('#mapid').each(function () {
        //Map
        var mymap = L.map('mapid', {
            center: [40.7699999999999, -73.94695250692637],
            zoom: 11.5
        });

        //Basemap
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.mapbox-streets-v7',
            accessToken: 'pk.eyJ1IjoiaXNzYW1hcCIsImEiOiJjaXp1MWh5aTQwMjc2MndvY3o3NWVwaW5hIn0.6adc7SKDh4d5THrENfsR5w'
        }).addTo(mymap);

        //Add Controls
        control = L.control.layers(null, null, { position: 'topright', collapsed: false }).addTo(mymap);


        //StyleShoolPoints
        var SchoolsStyle = {
            radius: 7,
            fillColor: "#ff7800",
            color: "#000",
            weight: 4,
            opacity: 0,
            fillOpacity: 0.8
        };

        //StyleZones
        var ZoneStyle = {
            fillColor: '#AAB1C0',
            color: "#1B2D79",
            weight: 2,
            opacity: 1,
            fillopacity: 1,
        };

        //Style Buffers
        var BuffStyle = {
            fillColor: '#008000',
            color: "#32CD32",
            weight: 2,
            opacity: 1,
            fillopacity: 1,
        };



        //Schools onEachFeature function
        function onEachFeaturesch(feature, layer) {
            layer.on({
                mouseover: highlightsch,
                mouseout: dehighlightsch,
                click: clickonsch,
            });
        }

        //Zones onEachFeature function
        function onEachFeaturezone(feature, layer) {
            layer.on({
                mouseover: highlightzone,
                mouseout: dehighlightzone,
            });
        }

        //Add School Layer
        $.getJSON("jsons/NewSchools.geojson", function (data) {
            Schools_lc = new L.GeoJSON(data, {
                onEachFeature: onEachFeaturesch,
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, SchoolsStyle);
                }
            })
            mymap.addLayer(Schools_lc);
            control.addOverlay(Schools_lc, "Schools");
            return Schools_lc
        });

        //Add Zones layer
        var Zones_lc = {};
        $.getJSON("jsons/ManhattanZones.geojson", function (data) {
            Zones_lc = new L.GeoJSON(data, {
                style: ZoneStyle,
            });
            mymap.addLayer(Zones_lc);
            Zones_lc.bringToBack();
            control.addOverlay(Zones_lc, "School Zones");
            return Zones_lc;
        });

        //Add Buffers layer
        var Buffers = {};
        $.getJSON("jsons/Sch_Buffers.geojson", function (data) {
            Buffers = new L.GeoJSON(data, {
                style: ZoneStyle,
            });
            return Buffers;
        });


        //Dehighlight schools
        function dehighlightsch(e) {
            var layer = e.target;
            var dbn = e.target.feature.properties.ATS_Code;
            layer.setStyle(SchoolsStyle);
            mymap.closePopup();
            //Indentify rlated Zone
            var match = null;
            Zones_lc.eachLayer(function (layer) {
                if (layer.feature.properties.dbn == dbn) {
                    match = layer;
                }
            }, dbn); 
            if (match != null) {
                match.setStyle(ZoneStyle);
            }

        }

        //Highlight schools when hovering
        function highlightsch(e) {
            var layer = e.target;
            var dbn = e.target.feature.properties.ATS_Code;
            var schname = e.target.feature.properties.School_Name;

            //Indentify related Zone
            var match = null;

            // Geojson layer is actually a collection of layers, so you have to iterate 
            // through them to find the one you want. 
            Zones_lc.eachLayer(function (layer) {
                if (layer.feature.properties.dbn == dbn) {
                    match = layer;
                }
            }, dbn);  // Note the second parameter to eachLayer lets you pass in data.
            // Otherwise dbn isn't visible from within eachLayer.    
            if (match != null) {
                layer.setStyle({
                    fillColor: '#b80404',
                    color: '#000000',
                    fillOpacity: 1,
                });
                layer.bindPopup('<strong>DBN:</strong>' + dbn + '<br><strong>School Name:</strong>' + schname).openPopup();
                match.setStyle({
                    fillColor: '#D7E2E8',
                    color: '#000000',
                    fillOpacity: .4,
                });
            }
        }


        buffmatch = null;
        function clickonsch(e) {
            console.log('click function')
            var layer1 = e.target;
            var dbn = e.target.feature.properties.ATS_Code;
            var schname = e.target.feature.properties.School_Name;

            var match = null;

            // Geojson layer is actually a collection of layers, so you have to iterate 
            // through them to find the one you want. 
            Zones_lc.eachLayer(function (layer) {
                if (layer.feature.properties.dbn == dbn) {
                    match = layer;
                }
            }, dbn);  // Note the second parameter to eachLayer lets you pass in data.
            // Otherwise dbn isn't visible from within eachLayer. 

            if (match != null) {
                console.log('not null')
                mymap.fitBounds(match.getBounds());
            }

            //buffmatch = null;

            Buffers.eachLayer(function (layer) {
                if (layer.feature.properties.Name.substring(0, 6) == dbn) {
                    buffmatch = layer;
                }
            }, dbn);

            if (buffmatch != null) {
                mymap.removeLayer(buffmatch);
                buffmatch.setStyle(BuffStyle);
                mymap.addLayer(buffmatch);
                control.addOverlay(buffmatch, dbn+" Walking Radius");
            }
        }


        //Set up draw controls
        var that = this;
        var drawControl = null;
        var geoJsonLayer = null;

        $("#draw_poly").click(function () {
            setUpDraw();
        });

        var setUpDraw = function () {
            console.log('DRAW')
            // ****************************************************************
            // Adding draw controls
            // ****************************************************************
            // Initialize the FeatureGroup to store editable layers
            var drawnItems = new L.FeatureGroup().addTo(mymap);
            if (drawControl) {
                mymap.removeControl(drawControl);
            }
            drawControl = new L.Control.Draw({
                draw: {
                    position: 'topleft',
                    polygon: {
                        allowIntersection: true,
                        shapeOptions: {
                            color: '#000000'
                        },
                        selectedPathOptions: {
                            maintainColor: true,
                            opacity: 0.3
                        }
                    },
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: false
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true
                }
            }).addTo(mymap);

            var updateDrawing = function (layer) {
                editingLayer = layer;
                var poly = editingLayer.toGeoJSON();
                mymap.addLayer(editingLayer);
                mymap.fitBounds(editingLayer.getBounds());

            };

            mymap.on('draw:created', function (e) {
                drawingNow = false;
                updateDrawing(e.layer);
                $(".leaflet-draw-edit-edit").css("display", "block");
            });

            mymap.on('draw:drawstart', function () {
                drawingNow = true;
                if (geoJsonLayer) {
                    map.removeLayer(geoJsonLayer);
                }
                $(".leaflet-clickable").attr("fill", "#000000");
                $(".leaflet-draw-actions a").css("color", "rgb(255,255,255)");
            });

            mymap.on('draw:editstart', function () {
                drawingNow = true;
                $(".leaflet-draw-actions a").css("color", "rgb(255,255,255)");
            });

            mymap.on('draw:editstop', function () {
                drawingNow = false;
                updateDrawing(editingLayer);
            });
        };


        $("#clear").click(function () {
            clearmap();
        });

        var clearmap = function () {
            mymap.removeLayer(editingLayer);
            mymap.setView(new L.LatLng(40.7699999999999, -73.94695250692637), 11.5);
        }


        $("#uploadcsv").click(function () {
            //$.getScript("loadCSVCopy.js", function () {

                setupDropZone();
            //});
        });



    });
});