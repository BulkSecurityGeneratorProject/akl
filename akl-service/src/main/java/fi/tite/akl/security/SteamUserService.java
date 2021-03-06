package fi.tite.akl.security;

import com.github.koraktor.steamcondenser.exceptions.SteamCondenserException;
import com.github.koraktor.steamcondenser.steam.community.SteamId;
import com.lukaspradel.steamapi.core.exception.SteamApiException;
import com.lukaspradel.steamapi.data.json.playersummaries.GetPlayerSummaries;
import com.lukaspradel.steamapi.data.json.playersummaries.Player;
import fi.tite.akl.domain.User;
import fi.tite.akl.repository.SteamCommunityRepository;
import fi.tite.akl.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.openid.OpenIDAuthenticationToken;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for managing steam users.
 */
@Slf4j
@Service
public class SteamUserService implements AuthenticationUserDetailsService<OpenIDAuthenticationToken> {

    @Inject
    private UserService userService;

    @Inject
    private SteamCommunityRepository steamCommunityRepository;

    @Override
    public UserDetails loadUserDetails(OpenIDAuthenticationToken token) throws UsernameNotFoundException {
        if (token != null && token.getName() != null) {
            String[] parts = token.getName().split("/");
            if (parts.length == 6) {
                String domain = parts[2];
                if (domain.equals("steamcommunity.com")) try {
                    String communityId = parts[5];
                    String steamId = SteamId.convertCommunityIdToSteamId(
                            Long.parseUnsignedLong(parts[5]));

                    User user = userService.getUserWithAuthorities(communityId);

                    if (user != null) {
                        List<GrantedAuthority> authorities = user.getAuthorities().stream()
                                .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                                .collect(Collectors.toList());

                        return new org.springframework.security.core.userdetails
                                .User(user.getLogin(), "", authorities);
                    }

                    GetPlayerSummaries summaries = steamCommunityRepository.findSteamUser(communityId);

                    Optional<Player> player = summaries.getResponse().getPlayers().stream().findFirst();

                    if (player.isPresent()) {
                        user = userService.createSteamLoginUser(communityId, steamId,
                                player.get().getPersonaname());
                    } else {
                        user = userService.createSteamLoginUser(communityId, steamId, null);
                    }

                    return new org.springframework.security.core.userdetails
                            .User(user.getLogin(), "", AuthorityUtils.createAuthorityList(AuthoritiesConstants.USER));
                } catch (SteamCondenserException | SteamApiException | NumberFormatException ex) {
                    log.error(ex.getLocalizedMessage());
                }
            }
        }

        throw new UsernameNotFoundException("Steam authentication failed");
    }
}
