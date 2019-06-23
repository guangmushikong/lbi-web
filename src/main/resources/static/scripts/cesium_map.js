var geoserver="http://111.202.109.211:8080";
function init(){
    resizeMap();
    initMap();
}

function initMap(){
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNmE2Zjk5Yi1iNzczLTRiNzQtOTFkYi03YjExZmU0YTc5NzQiLCJpZCI6OTI3OSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1Mzc1NzgxOX0.-QnaM3w17Vg184NNN7F9oOIQFfuGrWRKF6zjf25jKEQ';
    //var viewer = new Cesium.Viewer('mapbox');
    var terrainProvider = new Cesium.CesiumTerrainProvider({url: geoserver+"/tms/1.0.0/gujiaodem_terrain@EPSG:4326@terrain"});
    //var terrainProvider = Cesium.createWorldTerrain();
    var viewer = new Cesium.Viewer('mapbox', {
        terrainProvider : terrainProvider
    });
    //var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(116.4, 39.9, 100), 15000);
    var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(111.98, 37.98, 100), 15000);
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
        // Fly to custom position
        viewer.camera.flyToBoundingSphere(boundingSphere);

        // Tell the home button not to do anything
        commandInfo.cancel = true;
    });

    // Set custom initial position
    viewer.camera.flyToBoundingSphere(boundingSphere, {duration: 0});
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