package com.lbi.tile.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;



/*************************************
 * Class Name: PageController
 * Description:〈页面控制器〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Controller
public class PageController {
    @Value("${service.mapserver}")
    String mapserver;

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
     * 元数据
     */
    @RequestMapping("/meta")
    public String meta(){
        return "meta";
    }

    /**
     * 示例
     */
    @RequestMapping("/demo")
    public String demo(){
        return "demo";
    }

    @RequestMapping("/demo/loc")
    public ModelAndView loc(
            @RequestParam(value = "x",required=false, defaultValue="0.0") double x,
            @RequestParam(value = "y",required=false, defaultValue="0.0") double y,
            @RequestParam(value = "z",required=false, defaultValue="0") int z){
        ModelAndView mav = new ModelAndView("demo/loc");
        mav.addObject("x", x);
        mav.addObject("y", y);
        mav.addObject("z", z);
        mav.addObject("mapserver", mapserver);
        return mav;
    }

    @RequestMapping("/demo/cesium")
    public ModelAndView cesium(
            @RequestParam(value = "x",required=false, defaultValue="0.0") double x,
            @RequestParam(value = "y",required=false, defaultValue="0.0") double y,
            @RequestParam(value = "z",required=false, defaultValue="0") int z){
        ModelAndView mav = new ModelAndView("demo/cesium");
        mav.addObject("x", x);
        mav.addObject("y", y);
        mav.addObject("z", z);
        mav.addObject("mapserver", mapserver);
        return mav;
    }

    @RequestMapping("/demo/cesium_zhaotong")
    public String cesium_zhaotong(){
        return "demo/cesium_zhaotong";
    }

    @RequestMapping("/demo/cesium_gujiao")
    public String cesium_gujiao(){
        return "demo/cesium_gujiao";
    }

    @RequestMapping("/demo/cesium_china")
    public String cesium_china(){
        return "demo/cesium_china";
    }

    @RequestMapping("/meta/dataset")
    public ModelAndView dataset(){
        ModelAndView mav = new ModelAndView("meta/dataset");
        mav.addObject("mapserver", mapserver);
        return mav;
    }
    @RequestMapping("/meta/project")
    public ModelAndView project(){
        ModelAndView mav = new ModelAndView("meta/project");
        mav.addObject("mapserver", mapserver);
        return mav;
    }

    @RequestMapping("/meta/user")
    public ModelAndView user(){
        ModelAndView mav = new ModelAndView("meta/user");
        mav.addObject("mapserver", mapserver);
        return mav;
    }

    @RequestMapping("/meta/tilemap")
    public ModelAndView tilemap(){
        ModelAndView mav = new ModelAndView("meta/tilemap");
        mav.addObject("mapserver", mapserver);
        return mav;
    }

    @RequestMapping("/meta/tileset")
    public ModelAndView tileset(@RequestParam("mapId") long mapId){
        ModelAndView mav = new ModelAndView("meta/tileset");
        mav.addObject("mapserver", mapserver);
        mav.addObject("mapId", mapId);
        return mav;
    }

    @RequestMapping("/meta/mapsets")
    public ModelAndView mapsets(){
        ModelAndView mav = new ModelAndView("meta/mapsets");
        mav.addObject("mapserver", mapserver);
        return mav;
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
