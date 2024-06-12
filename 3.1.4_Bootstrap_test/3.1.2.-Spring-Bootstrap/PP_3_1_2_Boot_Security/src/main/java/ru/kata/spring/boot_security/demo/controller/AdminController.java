package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/admin")
public class AdminController {

    private final RoleService roleService;
    private final UserService userService;

    @Autowired
    public AdminController(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;

    }

    @GetMapping("/list")
    public ModelAndView allUsers() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("adminPageRest");

        List<User> users = userService.getAllUsersList();
        List<Role> roleList = roleService.getListRoles();
        modelAndView.addObject("userList", users);
        modelAndView.addObject("roleList", roleList);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userService.findByUserName(auth.getName());
        modelAndView.addObject("userCurrent", user.get());

        return modelAndView;
    }

}
