
package com.lbi.tile.controller;

import com.alibaba.fastjson.JSON;
import com.lbi.tile.model.ResultBody;
import com.lbi.tile.model.TileSetDO;
import com.lbi.tile.service.TileMapService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************
 * Class Name: TileSetController
 * Description:〈瓦片数据集Controller〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@CrossOrigin
@RestController
@RequestMapping("/tileset")
@Slf4j
public class TileSetController {
    @Autowired
    TileMapService tileMapService;

    @GetMapping(value="/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody listTileSet(@RequestParam("mapId") long mapId) {
        List<TileSetDO> list=tileMapService.listTileSet(mapId);
        return new ResultBody<>(list);
    }

    @PostMapping(value="/add", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody addTileSet(@RequestBody TileSetDO tileSetDO) {
        log.info("【addTileSet】"+ JSON.toJSONString(tileSetDO));
        tileMapService.addTileSet(tileSetDO);
        return new ResultBody<>(0,"OK");
    }

    @GetMapping(value="/del", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody delTileSet(@RequestParam("id") long id) {
        log.info("【delTileSet】id:{}",id);
        tileMapService.delTileSet(id);
        return new ResultBody<>(0,"OK");
    }
}
