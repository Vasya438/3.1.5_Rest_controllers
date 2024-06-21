package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class PageController {

    @GetMapping("/user")
    public String user() {
        return "user";
    }

    @GetMapping("/admin/users")
    public String admin() {
        return "admin";
    }

}