/**************************************
 * Copyright (C), Navinfo
 * Package: com.lbi.tile.controller
 * Author: liumingkai05559
 * Date: Created in 2018/8/12 16:59
 **************************************/
package com.lbi.tile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/*************************************
 * Class Name: PageController
 * Description:〈页面控制器〉
 * @author liumingkai
 * @create 2018/8/12
 * @since 1.0.0
 ************************************/
@Controller
public class PageController {
    @Autowired
    DiscoveryClient discoveryClient;
    /**
     * 首页
     */
    @RequestMapping("/")
    public String index(){
        return "index";
    }

    /**
     * 登录页面
     */
    @RequestMapping("/login")
    public String login(){
        return "login";
    }

    /**
     * 接口文件
     */
    @RequestMapping("/apidoc")
    public ModelAndView apidoc(){
        List<ServiceInstance> list = discoveryClient.getInstances("LBS-SERVER");
        if(!list.isEmpty()){
            ServiceInstance instance=list.get(0);
            ModelAndView mav=new ModelAndView("redirect:"+instance.getUri()+"/swagger-ui.html");
            return mav;
        }
        return null;
    }

    /**
     * 元数据
     */
    @RequestMapping("/meta")
    public String meta(){
        return "meta";
    }

    @RequestMapping("/meta/loc")
    public ModelAndView loc(
            @RequestParam(value = "x",required=false, defaultValue="0.0") double x,
            @RequestParam(value = "y",required=false, defaultValue="0.0") double y,
            @RequestParam(value = "z",required=false, defaultValue="0") int z){
        ModelAndView mav = new ModelAndView("meta/loc");
        mav.addObject("x", x);
        mav.addObject("y", y);
        mav.addObject("z", z);
        return mav;
    }

    @RequestMapping("/meta/cesium")
    public ModelAndView cesium(
            @RequestParam(value = "x",required=false, defaultValue="0.0") double x,
            @RequestParam(value = "y",required=false, defaultValue="0.0") double y,
            @RequestParam(value = "z",required=false, defaultValue="0") int z){
        ModelAndView mav = new ModelAndView("meta/cesium");
        mav.addObject("x", x);
        mav.addObject("y", y);
        mav.addObject("z", z);
        return mav;
    }

    @RequestMapping("/meta/dataset")
    public String dataset(){
        return "meta/dataset";
    }
    @RequestMapping("/meta/project")
    public String project(){
        return "meta/project";
    }

    @RequestMapping("/meta/directory")
    public String directory(){
        return "meta/directory";
    }

    @RequestMapping("/meta/mapsets")
    public String mapsets(){
        return "meta/mapsets";
    }

    @RequestMapping("/admin")
    public String admin(){
        return "admin";
    }

    @RequestMapping("/admin/logs")
    public String logs(){
        return "admin/logs";
    }
}
