
package com.lbi.tile.service;

import com.lbi.tile.dao.ProjectDao;
import com.lbi.tile.model.ProjectDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*************************************
 * Class Name: ProjectService
 * Description:〈ProjectService〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Service
public class ProjectService {
    @Autowired
    ProjectDao projectDao;

    public List<ProjectDO> listProject(){
        return projectDao.listProject();
    }

    public ProjectDO getProject(long id){
        return projectDao.getProject(id);
    }

    public void addProject(ProjectDO projectDO){
        projectDao.addProject(projectDO);
    }

    public void updateProject(ProjectDO projectDO){
        projectDao.updateProject(projectDO);
    }

    public void delProject(long id){
        projectDao.delProject(id);
    }
}
