
var viewer;
function init(){
    resizeMap();
    initMap();
}
function initMap(){
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNmE2Zjk5Yi1iNzczLTRiNzQtOTFkYi03YjExZmU0YTc5NzQiLCJpZCI6OTI3OSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1Mzc1NzgxOX0.-QnaM3w17Vg184NNN7F9oOIQFfuGrWRKF6zjf25jKEQ';
    //高德街道底图
    var imagerLayer = new Cesium.UrlTemplateImageryProvider({
        url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
    });
    //加载地形数据
    var terrainLayer = new Cesium.CesiumTerrainProvider({
        url: "http://211.154.194.45:8080/tms/1.0.0/zhaotong_terrain@EPSG:4326@terrain",
        // 请求照明
        requestVertexNormals: true,
        // 请求水波纹效果
        requestWaterMask: true
    });
    viewer = new Cesium.Viewer('mapbox', {
       animation: false, //是否创建动画小器件，左下角仪表
       timeline: false, //是否显示时间轴
       navigationHelpButton: false, //是否显示右上角的帮助按钮
       infoBox: true,  //是否显示点击要素之后显示的信息
       //imageryProvider: imagerLayer,
       terrainProvider: terrainLayer
    });
    viewer.scene.globe.enableLighting = true;   //开启全球光照
    viewer.sceneModePicker.viewModel.duration = 0.0;//去掉二三维切换动画效果
    
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(e) {
        e.cancel = true;
        //你要飞的位置
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(103.7076566,27.2305291,2114)
        });
    });

    /* 三维球转动添加监听事件 */
    viewer.camera.changed.addEventListener(function (percentage) {
        var pt=getCenterPosition();
        var ext=getCurrentExtent();
        // 打印中心点坐标、高度、当前范围坐标
        $("#i_coordinate").text("当前坐标:"+pt.lon.toFixed(7)+","+pt.lat.toFixed(7)+","+pt.height.toFixed(0));
        //console.log("bounds",JSON.stringify(ext));
        var str=[];
        if(ext.xmin)str.push(ext.xmin.toFixed(7));
        if(ext.ymin)str.push(ext.ymin.toFixed(7));
        if(ext.xmax)str.push(ext.xmax.toFixed(7));
        if(ext.ymax)str.push(ext.ymax.toFixed(7));

        $("#i_extent").text("边界["+str.join(",")+"],高度:"+ext.height.toFixed(0));
    });
	//获取鼠标单击处的经度、纬度、高程
var CesiumEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    var ellipsoid = viewer.scene.globe.ellipsoid;   //得到当前三维场景的椭球体
CesiumEventHandler.setInputAction(function (movement) {
    var cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);  //将笛卡尔坐标转换为地理坐标
        var longitudeDegree = Cesium.Math.toDegrees(cartographic.longitude);
        var latitudeDegree = Cesium.Math.toDegrees(cartographic.latitude);
        var cartographic2 = Cesium.Cartographic.fromDegrees(longitudeDegree, latitudeDegree);
        var terrainLevel = 14;
        var promise = Cesium.sampleTerrain(terrainLayer, terrainLevel, [cartographic2]);
        Cesium.when(promise, function (updatedPositions) {
                if (updatedPositions.length > 0) {
                    $("#i_click").text('经度:' + Cesium.Math.toDegrees(updatedPositions[0].longitude).toFixed(7)+
                            ',纬度:' + Cesium.Math.toDegrees(updatedPositions[0].latitude).toFixed(7) +
                            ',高程:' +  (updatedPositions[0].height ? updatedPositions[0].height.toFixed(0) : 0));
 
                } else {
                    $("#i_click").text('无法获取高程');
                }
        });
    }  
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.scene.camera.setView({
        // 初始化相机经纬度
        destination : new Cesium.Cartesian3.fromDegrees(103.7076566,27.2304291,2114)
    });

}
/* 获取camera高度  */
function getHeight() {
  if (viewer) {
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var height = ellipsoid.cartesianToCartographic(viewer.camera.position).height;
    return height;
  }
}

/* 获取camera中心点坐标 */
function getCenterPosition() {
  var result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas
    .clientHeight / 2));
  var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
  var lon = curPosition.longitude * 180 / Math.PI;
  var lat = curPosition.latitude * 180 / Math.PI;
  var height = getHeight();
  return {
    lon: lon,
    lat: lat,
    height: height
  };
}

function getCurrentExtent() {
    // 范围对象
    var extent = {};

    // 得到当前三维场景
    var scene = viewer.scene;

    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var canvas = scene.canvas;

    // canvas左上角
    var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);

    // canvas右下角
    var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);

    // 当canvas左上角和右下角全部在椭球体上
    if (car3_lt && car3_rb) {
        var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
        var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
    }

    // 当canvas左上角不在但右下角在椭球体上
    else if (!car3_lt && car3_rb) {
        var car3_lt2 = null;
        var yIndex = 0;
        do {
            // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
            yIndex <= canvas.height ? yIndex += 10 : canvas.height;
            car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid);
        } while (!car3_lt2);
        var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
        var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
    }

    // 获取高度
    extent.height = Math.ceil(viewer.camera.positionCartographic.height);
    return extent;
}

/**
 * 容器改变触发
 */
function resizeMap(){
    //初始化宽度、高度
    $("#mapbox").height($(window).height()-150);
    //当文档窗口发生改变时 触发
    $(window).resize(function(){
        $("#mapbox").height($(window).height()-150);
    });
}