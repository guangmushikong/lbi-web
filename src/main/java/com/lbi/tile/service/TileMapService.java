
package com.lbi.tile.service;

import com.lbi.tile.dao.TileMapDao;
import com.lbi.tile.model.TileMapDO;
import com.lbi.tile.model.TileSetDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*************************************
 * Class Name: TileMapService
 * Description:〈瓦片地图Service〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Service
public class TileMapService {
    @Autowired
    TileMapDao tileMapDao;

    public List<TileMapDO> listTileMap(){
        return tileMapDao.listTileMap();
    }

    public TileMapDO getTileMap(long id){
        return tileMapDao.getTileMap(id);
    }

    public List<TileSetDO> listTileSet(long mapId){
        return tileMapDao.listTileSet(mapId);
    }

    public void addTileSet(TileSetDO tileSetDO){
        tileMapDao.addTileSet(tileSetDO);
    }

    public void delTileSet(long id){
        tileMapDao.delTileSet(id);
    }
}
