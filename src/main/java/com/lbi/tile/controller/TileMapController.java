
package com.lbi.tile.controller;

import com.lbi.tile.model.ResultBody;
import com.lbi.tile.model.TileMapDO;
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
        List<TileMapDO> list=tileMapService.listTileMap();
        return new ResultBody<>(list);
    }

    @GetMapping(value="/get", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody getProject(@RequestParam("id") long id) {
        TileMapDO result=tileMapService.getTileMap(id);
        return new ResultBody<>(result);
    }
}
