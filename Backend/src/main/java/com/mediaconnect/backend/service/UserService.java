package com.mediaconnect.backend.service;

import com.mediaconnect.backend.dto.UserDTO;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();

    UserDTO getUserByEmail(String email);

    UserDTO updateUser(String email, UserDTO userDTO);

    UserDTO subscribe(String email, String plan);
}
