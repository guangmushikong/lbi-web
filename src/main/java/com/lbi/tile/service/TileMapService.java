
package com.lbi.tile.service;

import com.lbi.tile.dao.TileMapDao;
import com.lbi.tile.model.TileMapVO;
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

    public List<TileMapVO> listTileMap(){
        return tileMapDao.listTileMap();
    }

    public TileMapVO getTileMap(long id){
        return tileMapDao.getTileMap(id);
    }

    public void addTileMap(TileMapVO tileMap){
        tileMapDao.addTileMap(tileMap);
    }

    public void updateTileMap(TileMapVO tileMap){
        tileMapDao.updateTileMap(tileMap);
    }

    public void delTileMap(long id){
        tileMapDao.delTileMap(id);
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
