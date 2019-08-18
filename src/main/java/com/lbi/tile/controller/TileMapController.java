
package com.lbi.tile.controller;

import com.alibaba.fastjson.JSON;
import com.lbi.tile.model.ResultBody;
import com.lbi.tile.model.TileMapVO;
import com.lbi.tile.service.TileMapService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************
 * Class Name: TileMapController
 * Description:〈瓦片地图Controller〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@CrossOrigin
@RestController
@RequestMapping("/tilemap")
@Slf4j
public class TileMapController {
    @Autowired
    TileMapService tileMapService;

    @GetMapping(value="/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody listTileMap() {
        List<TileMapVO> list=tileMapService.listTileMap();
        return new ResultBody<>(list);
    }

    @GetMapping(value="/get", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody getTileMap(@RequestParam("id") long id) {
        TileMapVO result=tileMapService.getTileMap(id);
        return new ResultBody<>(result);
    }

    @PostMapping(value="/add", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody addTileMap(@RequestBody TileMapVO tileMap) {
        log.info("【addTileMap】"+ JSON.toJSONString(tileMap));
        tileMapService.addTileMap(tileMap);
        return new ResultBody<>(0,"OK");
    }

    @PostMapping(value="/save", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody updateTileMap(@RequestBody TileMapVO tileMap) {
        log.info("【updateTileMap】"+ JSON.toJSONString(tileMap));
        tileMapService.updateTileMap(tileMap);
        return new ResultBody<>(0,"OK");
    }

    @GetMapping(value="/del", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody delTileMap(@RequestParam("id") long id) {
        log.info("【delTileMap】id:{}",id);
        tileMapService.delTileMap(id);
        return new ResultBody<>(0,"OK");
    }
}
