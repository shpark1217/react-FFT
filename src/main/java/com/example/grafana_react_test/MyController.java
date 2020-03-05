package com.example.grafana_react_test;

import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
 
@Controller
public class MyController {
 
    @GetMapping("/{name}.html")
    public String page(@PathVariable String name, Model model, ServletResponse response) {
        model.addAttribute("pageName", name);
        return "page";
    }
 
}