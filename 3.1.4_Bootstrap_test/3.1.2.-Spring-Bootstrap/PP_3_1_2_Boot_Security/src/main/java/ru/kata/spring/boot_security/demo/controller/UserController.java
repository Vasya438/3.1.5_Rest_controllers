package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import java.util.Optional;

@RestController
public class UserController {
    private final UserServiceImpl userService;

    @Autowired
    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public ModelAndView getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userService.findByUserName(auth.getName());
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("userPageRest");
        modelAndView.addObject("userCurrent", user.get());
        return modelAndView;
    }
}
