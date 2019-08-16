
package com.lbi.tile.service;

import com.lbi.tile.dao.DataSetDao;
import com.lbi.tile.dao.ProjectDao;
import com.lbi.tile.model.DataSetDO;
import com.lbi.tile.model.ProjectDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*************************************
 * Class Name: DataSetService
 * Description:〈数据集Service〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Service
public class DataSetService {
    @Autowired
    DataSetDao dataSetDao;
    @Autowired
    ProjectDao projectDao;

    public List<DataSetDO> listDataSet(){
        return dataSetDao.listDataSet();
    }

    public List<DataSetDO> listDataSet(long projectId){
        ProjectDO projectDO=projectDao.getProject(projectId);
        return dataSetDao.listDataSet(projectDO.getDatasetIds());
    }

    public void addDataSet(DataSetDO dataSetDO){
        dataSetDao.addDataSet(dataSetDO);
    }

    public void updateDataSet(DataSetDO dataSetDO){
        dataSetDao.updateDataSet(dataSetDO);
    }

    public void delDataSet(long id){
        dataSetDao.delDataSet(id);
    }
}
