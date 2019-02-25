package com.lbi.tile.service;

import com.lbi.tile.dao.MetaDao;
import com.lbi.tile.model.DataSetDO;
import com.lbi.tile.model.ProjectDO;

import org.springframework.stereotype.Service;

import javax.annotation.Resource;

import java.util.List;


@Service("metaService")
public class MetaService {
    @Resource(name="metaDao")
    private MetaDao metaDao;

    public List<ProjectDO> getProjectList(){
        return metaDao.getProjectList();
    }

    public ProjectDO getProjectById(long id){
        return metaDao.getProjectById(id);
    }

    public List<DataSetDO> getDataSetList(){
        List<DataSetDO> list= metaDao.getDataSetList();

        return list;
    }

    public DataSetDO getDataSetById(long id){
        return metaDao.getDataSetById(id);
    }
}
