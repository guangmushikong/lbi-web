package com.lbi.tile.controller;

import com.alibaba.fastjson.JSON;
import com.lbi.tile.model.ProjectDO;
import com.lbi.tile.model.ResultBody;
import com.lbi.tile.service.ProjectService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************
 * Class Name: ProjectController
 * Description:〈项目Controller〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@CrossOrigin
@RestController
@RequestMapping("/project")
@Slf4j
public class ProjectController {
    @Autowired
    ProjectService projectService;

    @GetMapping(value="/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody listProject() {
        List<ProjectDO> list=projectService.listProject();
        return new ResultBody<>(list);
    }

    @GetMapping(value="/get", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody getProject(@RequestParam("id") long id) {
        ProjectDO result=projectService.getProject(id);
        return new ResultBody<>(result);
    }

    @PostMapping(value="/add", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody addProject(@RequestBody ProjectDO projectDO) {
        log.info("【addProject】"+ JSON.toJSONString(projectDO));
        projectService.addProject(projectDO);
        return new ResultBody<>(0,"OK");
    }

    @PostMapping(value="/save", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody updateProject(@RequestBody ProjectDO projectDO) {
        log.info("【updateProject】"+ JSON.toJSONString(projectDO));
        projectService.updateProject(projectDO);
        return new ResultBody<>(0,"OK");
    }

    @GetMapping(value="/del", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody delProject(@RequestParam("id") long id) {
        log.info("【delProject】id:{}",id);
        projectService.delProject(id);
        return new ResultBody<>(0,"OK");
    }
}
