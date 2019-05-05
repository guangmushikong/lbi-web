package com.lbi.tile.service;

import com.lbi.model.ResultBody;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("lbs-server")
public interface RefactorLBSServer {

    @GetMapping("/projects")
    ResultBody getProjectList();

    @GetMapping("/projects/{projectId}")
    ResultBody getProject(@PathVariable("projectId") long projectId);

    @GetMapping("/projects/datasets")
    ResultBody getAllatasetList();

    @GetMapping("/projects/{projectId}/datasets/{datasetId}")
    ResultBody getDataset(
            @PathVariable("projectId") long projectId,
            @PathVariable("datasetId") long datasetId);
}
