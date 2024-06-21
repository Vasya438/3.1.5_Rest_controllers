package ru.kata.spring.boot_security.demo.InitDataBase;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.Set;

@Component
public class InitDataBase {
    private final UserService userService;
    private final RoleService roleService;

    public InitDataBase(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void initUsers() {
        initAdmin();
        initUser();
    }

    public void initAdmin() {
        Role roleAdmin = new Role("ROLE_ADMIN");
        Role saveRole = roleService.saveRole(roleAdmin);
        User user = new User("Admin", "admin@mail.ru", "admin", "admin", Set.of(saveRole));
        userService.addUser(user);
    }

    public void initUser() {
        Role roleUser = new Role("ROLE_USER");
        Role saveRole = roleService.saveRole(roleUser);
        User user = new User("User", "user@mail.ru", "user", "user", Set.of(saveRole));
        userService.addUser(user);
    }
}
