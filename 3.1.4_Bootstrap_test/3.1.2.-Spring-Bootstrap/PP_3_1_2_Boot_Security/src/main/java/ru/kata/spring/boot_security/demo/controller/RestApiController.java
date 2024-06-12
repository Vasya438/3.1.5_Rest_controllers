package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/api")
public class RestApiController {
    private final RoleService roleService;
    private final UserService userService;

    @Autowired
    public RestApiController(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @GetMapping(value = "/list")
    public ResponseEntity<List<User>> getAllUsers() {
        final List<User> userList = userService.getAllUsersList();
        return userList != null && !userList.isEmpty()
                ? new ResponseEntity<>(userList, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value = "/add")
    public ResponseEntity<Object> addNew(@RequestBody User user) {
        getRoleAndSet(user);
        userService.addUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping(value = "/user/{id}")
    public ResponseEntity<User> read(@PathVariable(name = "id") Long id) {
        final User client = userService.getUserById(id);
        return client != null
                ? new ResponseEntity<>(client, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping(value = "/edit")
    public ResponseEntity<Object> editUser(@RequestBody User user) {
        getRoleAndSet(user);
        userService.updateUser(user.getId(), user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    private void getRoleAndSet(@RequestBody User user) {
        Set<Role> rolesToSave = new HashSet<>();
        for (Role role : user.getRoles()) {
            Role currentRole = roleService.getRoleByRoleName(role.getRole());
            rolesToSave.add(currentRole);
        }
        user.setRoles(rolesToSave);
    }
}
