var mapObj;
var cityList;
var commonstyle;
var geoserver="http://111.202.109.211:8080";
var xyMarker;
function init(){
    resizeMap();
    initCommonStyle();
    initMap();
    getRemoteIP();
}

function initCity(){
    $.get(
        "/city/getcitylist.json",
        function(json){
            if(json.success){
                var list=json.data;
                list.push({adcode:"111",name:"古交",x:111.69073008803707,y:37.59651465252423,minX:111.69073008803707,minY:37.59651465252423,maxX:112.50720463078976,maxY:38.25637888992949});
                list.push({adcode:"112",name:"静庄",x:104.77085056787423,y:35.10560793684285,minX:104.77085056787423,minY:35.10560793684285,maxX:105.14244032110284,maxY:35.58053135312061});
                list.push({adcode:"113",name:"云南",x:103.37809033219204,y:26.92051250519370,minX:103.37809033219204,minY:26.92051250519370,maxX:103.65317576522527,maxY:27.16169880229407});
                cityList=[];
                for(var i=0;i<list.length;i++){
                    var item=list[i];
                    cityList[item.adcode]=item;
                    var li='<option value="'+item.adcode+'"><i class="icon-star"></i>'+item.name+'</option>';
                    $("#m_city").append(li);
                }
                $("#m_city").select2();
                $('#m_city').change(function(){
                    var item=cityList[$('#m_city').val()];
                    mapObj.fitBounds([[item.minY,item.minX],[item.maxY, item.maxX]]);
                });
            }
        },"json");
}

function initOverlays(){
    var gujiao_satellite_xyz_png_Layer = L.tileLayer(geoserver+'/xyz/gujiao/{x}/{y}/{z}.png', {maxZoom: 17});
    var beijing_overlay_xyz_png_Layer = L.tileLayer(geoserver+'/xyz/1.0.0/beijing_satellite_overlay@EPSG:900913@png/{x}/{y}/{z}.png', {maxZoom: 18});
    var beijing_satellite_xyz_png_Layer = L.tileLayer(geoserver+'/xyz/1.0.0/beijing_satellite_raster@EPSG:900913@jpeg/{x}/{y}/{z}.jpg', {maxZoom: 18});
    var jingzhuang_satellite_xyz_png_Layer = L.tileLayer(geoserver+'/xyz/1.0.0/jingzhuang_satellite_raster@EPSG:900913@png/{x}/{y}/{z}.png', {maxZoom: 17});
    var world_satellite_xyz_png_Layer = L.tileLayer(geoserver+'/xyz/world/{x}/{y}/{z}.jpeg', {maxZoom: 13});
    var china_city_xyz_png_Layer = L.tileLayer(geoserver+'/xyz/city/{x}/{y}/{z}.png', {maxZoom: 13});
    var liupanshui_track_xyz_png_Layer = L.tileLayer(geoserver+'/xyz/liupanshui_track_line1/{x}/{y}/{z}.png', {maxZoom: 17});
    var china_city_xyz_geojson_Layer=initChina_City_xyz_geojson_Layer();
    var gujiao_xyz_geojson_Layer=initGujiao_Contour_xyz_geojson_Layer();
    var jingzhuang_xyz_geojson_Layer=initJingZhuang_Contour_xyz_geojson_Layer();


    var world_satellite_tms_png_Layer= L.tileLayer(geoserver+"/tms/1.0.0/world_satellite_raster@EPSG:900913@jpeg/{z}/{x}/{y}.jpeg", {
        maxZoom: 13,
        tms: true
    });
    var china_city_tms_png_Layer= L.tileLayer(geoserver+"/tms/1.0.0/china_city_polygon@EPSG:900913@png/{z}/{x}/{y}.png", {
        maxZoom: 11,
        tms: true
    });
    var gujiao_satellite_tms_png_Layer= L.tileLayer(geoserver+"/tms/1.0.0/gujiao_satellite_raster@EPSG:900913@png/{z}/{x}/{y}.png", {
        maxZoom: 17,
        tms: true
    });
    var jingzhuang_satellite_tms_png_Layer= L.tileLayer(geoserver+"/tms/1.0.0/jingzhuang_satellite_raster@EPSG:900913@png/{z}/{x}/{y}.png", {
        maxZoom: 17,
        tms: true
    });
    var liupanshui_satellite_tms_png_Layer= L.tileLayer(geoserver+"/tms/1.0.0/liupanshui_satellite_raster@EPSG:900913@png/{z}/{x}/{y}.png", {
        maxZoom: 17,
        tms: true
    });

    var yunnan_satellite_png_Layer2=L.tileLayer(geoserver+'/xyz/1.0.0/yunnan_satellite_timeraster_201709@EPSG:900913@png/{x}/{y}/{z}.png', {maxZoom: 17});
    var yunnan_satellite_png_Layer1=L.tileLayer(geoserver+'/xyz/1.0.0/yunnan_satellite_timeraster_201802@EPSG:900913@png/{x}/{y}/{z}.png', {maxZoom: 17});

    var overlays={
        '世界卫星影像':world_satellite_tms_png_Layer,
        '中国城市面':china_city_tms_png_Layer,
        '六盘水轨迹':liupanshui_track_xyz_png_Layer,
        '北京影像叠加':beijing_overlay_xyz_png_Layer,
        '北京卫星影像':beijing_satellite_xyz_png_Layer,
        '古交高分影像':gujiao_satellite_tms_png_Layer,
        '静庄高分影像':jingzhuang_satellite_tms_png_Layer,
        '六盘水高分影像':liupanshui_satellite_tms_png_Layer,
        '云南高分影像(201709)':yunnan_satellite_png_Layer2,
        '云南高分影像(201802)':yunnan_satellite_png_Layer1
    };
    return overlays;
}
function initMap(){
    var basemap_osm=L.tileLayer('https://c.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38');
    var basemap_normal=L.tileLayer('http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}');
    var basemap_satellite=L.tileLayer('http://mt3.google.cn/vt/lyrs=y@198&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&s=');
    var basemap_terrain=L.tileLayer('http://c.tile.stamen.com/terrain/{z}/{x}/{y}.png');

    var baseMaps={
        "OSM":basemap_osm,
        "高德":basemap_normal,
        "地球":basemap_satellite,
        "地形":basemap_terrain
    };
    var overlays=initOverlays();

    //初始化地图控件
    mapObj = L.map('mapbox', {
        center: [35.35,105],
        zoom: 10,
        minZoom:3,
        maxZoom:18,
        zoomControl:false,	//不加载默认zoomControl,
        layers: [basemap_osm]
    });

    var zoomControl = L.control.zoom({
        position: 'bottomright',
        zoomInTitle:'放大',
        zoomOutTitle:'缩小'
    }).addTo(mapObj);

    if($("#m_cenx").val()!=null){
        var cx=parseFloat($("#m_cenx").val());
        var cy=parseFloat($("#m_ceny").val());
        var cz=parseInt($("#m_cenz").val());
        console.log(cx+","+cy+","+cz);
        var latlng=new L.LatLng($("#m_ceny").val(),$("#m_cenx").val());
        mapObj.setView(latlng,$("#m_cenz").val());
    }

    L.control.layers(baseMaps,overlays).addTo(mapObj);
    L.control.scale({imperial:false}).addTo(mapObj);//去除英制单位
    viewMapOption();
    mapObj.on('move', viewMapOption);
    mapObj.on('mousemove', viewCoordinate);

    initMenuBar();
}
/**
 * 创建菜单条
 */
function initMenuBar(){
    var menu = L.control({position: 'topleft'});
    menu.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'btn-group'); // create a div with a class "info"
        this._div.id="m_menubar";
        this.update();
        return this._div;
    };
    menu.update = function (props) {
        var str='<select id="m_city" class="select2"></select>';
        this._div.innerHTML = str;
    };
    menu.addTo(mapObj);
    initCity();
}

function locationByXY(){
    if(xyMarker!=null)mapObj.removeLayer(xyMarker);
    var latlng=new L.LatLng($("#m_y").val(),$("#m_x").val());
    var svgIcon=new L.DivIcon.SVGIcon({
        color:'red',
        fillColor : 'red',
        iconSize : L.point(18,30)
    });
    xyMarker=new L.Marker(latlng,{icon:svgIcon}).addTo(mapObj);
    mapObj.setView(latlng);
}
function getRemoteIP(){
    $("#m_ip").text("您的访问IP:"+returnCitySN["cip"]);
}
function initCommonStyle(){
    commonstyle={};
    var myStyle={
        fillColor:'#FD8D3C',
        fillOpacity:0.3,
        color:'#000',
        dashArray:3,
        weight:2
    };
    commonstyle['init']=myStyle;
    myStyle={
        fillColor:'gray',
        fillOpacity:0.3,
        color:'#000',
        dashArray:3,
        weight:2
    };
    commonstyle['gray']=myStyle;
    myStyle={
        fillColor:'blue',
        fillOpacity:0.3,
        color:'#000',
        dashArray:3,
        weight:2
    };
    commonstyle['blue']=myStyle;
    myStyle={
        fillColor:'green',
        fillOpacity:0.3,
        color:'#000',
        dashArray:3,
        weight:2
    };
    commonstyle['green']=myStyle;
    myStyle={
        fillColor:'red',
        fillOpacity:0.7,
        color:'#f03',
        dashArray:'',
        weight:5
    };
    commonstyle['high']=myStyle;
    var svgIcon=new L.DivIcon.SVGIcon({
        color:'red',
        fillColor : 'red',
        iconSize : L.point(10,10)
    });
    var marker=new L.Marker({icon:svgIcon});
    commonstyle['poi']=marker;
}


function initChina_City_xyz_geojson_Layer(){
    var urlTemplate=geoserver+"/xyz/city/{x}/{y}/{z}.json";
    return new L.TileLayer.GeoJSON(urlTemplate,
        {
            clipTiles:true,
            unique:function(feature){
                return feature.properties.code;
            }
        },{
            style:commonstyle['gray'],
            onEachFeature:function(feature,layer){
                if(feature.properties){
                    var labelString='';
                    for(var k in feature.properties){
                        var v=feature.properties[k];
                        labelString+=k+':'+v+'<br/>';
                    }
                    layer.bindLabel(labelString);
                }
                if(!(layer instanceof L.Point)){
                    layer.on('mouseover',function(){
                        layer.setStyle(commonstyle['high']);
                    })
                    layer.on('mouseout',function(){
                        layer.setStyle(commonstyle['gray']);
                    })
                }
            }
        });
}

function initGujiao_Contour_xyz_geojson_Layer(){
    var urlTemplate=geoserver+"/xyz/1.0.0/gujiao_contour_line@EPSG:4326@geojson/{x}/{y}/{z}.json";
    return new L.TileLayer.GeoJSON(urlTemplate,
        {
            //tms: true,
	        clipTiles:true,
            unique:function(feature){
                return feature.id;
            }
        },{
            style:commonstyle['gray'],
            onEachFeature:function(feature,layer){
                if(feature.properties){
                    var labelString='';
                    for(var k in feature.properties){
                        var v=feature.properties[k];
                        labelString+=k+':'+v+'<br/>';
                    }
                    layer.bindLabel(labelString);
                }
                if(!(layer instanceof L.Point)){
                    layer.on('mouseover',function(){
                        layer.setStyle(commonstyle['high']);
                    })
                    layer.on('mouseout',function(){
                        layer.setStyle(commonstyle['gray']);
                    })
                }
            }
        });
}

function initJingZhuang_Contour_xyz_geojson_Layer(){
    var urlTemplate=geoserver+"/xyz/1.0.0/jingzhuang_contour_line@EPSG:4326@geojson/{x}/{y}/{z}.json";
    //var urlTemplate="http://localhost:8080/xyz/1.0.0/jingzhuang_contour_line@EPSG:4326@geojson/{x}/{y}/{z}.json";
    return new L.TileLayer.GeoJSON(urlTemplate,
        {
            //tms: true,
            clipTiles:true,
            unique:function(feature){
                return feature.id;
            }
        },{
            style:commonstyle['gray'],
            onEachFeature:function(feature,layer){
                if(feature.properties){
                    var labelString='';
                    for(var k in feature.properties){
                        var v=feature.properties[k];
                        labelString+=k+':'+v+'<br/>';
                    }
                    layer.bindLabel(labelString);
                }
                if(!(layer instanceof L.Point)){
                    layer.on('mouseover',function(){
                        layer.setStyle(commonstyle['high']);
                    })
                    layer.on('mouseout',function(){
                        layer.setStyle(commonstyle['gray']);
                    })
                }
            }
        });
}


/**
 * 容器改变触发
 */
function resizeMap(){
    //初始化宽度、高度
    $("#mapbox").height($(window).height()-120);
    //当文档窗口发生改变时 触发
    $(window).resize(function(){
        $("#mapbox").height($(window).height()-120);
    });
}
function viewCoordinate(evt){
    if(evt!=null) $("#i_coordinate").text("当前坐标:"+evt.latlng.lng.toFixed(7)+","+evt.latlng.lat.toFixed(7));
}
/**
 * 显示地图状态信息
 */
function viewMapOption(){
    var bounds=mapObj.getBounds();
    $("#i_map").text("级别="+mapObj.getZoom()+",中心("+bounds.getCenter().lng.toFixed(9)+","+bounds.getCenter().lat.toFixed(9)+")");
    $("#i_show").text("边界["+bounds.getSouthWest().lng.toFixed(9)+","+bounds.getNorthEast().lat.toFixed(9)+","+bounds.getSouthWest().lng.toFixed(9)+","+bounds.getNorthEast().lat.toFixed(9)+"]");
}
