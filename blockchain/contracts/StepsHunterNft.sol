// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; 
import "./ERC721OnChainMetadata.sol";
import "./StepsHunter.sol";
  
struct NftMetadataCreateParams {
    GoalStatus status; // Status
    uint durationDaysCount; // Duration days
    uint dayRecordsCount; //Tracked (days)
    uint maxFailDaysCount; // Allowed failed days
    uint failDaysCount; // Failed days"
    uint dailyStepsCount; // Required steps per day
    uint betAmount; // Goal bet amount (link)
}

contract StepsHunterNft is ERC721OnChainMetadata, Ownable {
    bytes constant goal_attribute_status_trait_type = "Status";
    uint constant goal_attribute_status_trait_index = 0;

    bytes constant goal_attribute_duration_days_count_trait_type = "Duration days";
    uint constant goal_attribute_duration_days_count_trait_index = 1;

    bytes constant goal_attribute_day_records_count_trait_type = "Tracked (days)";
    uint constant goal_attribute_day_records_count_trait_index = 2;

    bytes constant goal_attribute_max_fail_days_count_trait_type = "Allowed failed days";
    uint constant goal_attribute_max_fail_days_count_trait_index = 3;

    bytes constant goal_attribute_fail_days_count_trait_type = "Failed days";
    uint constant goal_attribute_fail_days_count_trait_index = 4;

    bytes constant goal_attribute_daily_steps_count_trait_type = "Required steps per day";
    uint constant goal_attribute_daily_steps_count_trait_index = 5;

    bytes constant goal_attribute_bet_amount_trait_type = "Goal bet amount (link)";
    uint constant goal_attribute_bet_amount_trait_index = 6;

    string constant SVG_START = '<svg width="268" height="386" viewBox="0 0 268 386" fill="none" xmlns="http://www.w3.org/2000/svg">';
    string constant SVG_END = '</svg>';
    string constant TEXT_STYLE = '<text style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 20.3px;" x="50" y="';
    string constant DEFS_START = '<defs>';
    string constant DEFS_END= '</defs>';

    mapping (GoalStatus => string) public goalStatusStyleMap;
    mapping (GoalStatus => string) public goalStatusTitleMap;
    mapping (GoalStatus => string[]) public goalStatusColorsMap;

    constructor() ERC721OnChainMetadata("Steps Hunter: Goals NFT", "SHN") {
        _addValue(_contractMetadata, key_contract_name, abi.encode("Steps Hunter: Goals NFT"));
        _addValue(_contractMetadata, key_contract_description, abi.encode(string(abi.encodePacked("Some description ", "", "."))));
        _addValue(_contractMetadata, key_contract_external_link, abi.encode(""));

        goalStatusTitleMap[GoalStatus.PENDING] = 'Pending';
        goalStatusTitleMap[GoalStatus.ACTIVE] = 'Active';
        goalStatusTitleMap[GoalStatus.PAUSE] = 'Pause';
        goalStatusTitleMap[GoalStatus.SUCCESS] = 'Success';
        goalStatusTitleMap[GoalStatus.FAIL] = 'Fail';
        goalStatusTitleMap[GoalStatus.ERROR] = 'Error';

        goalStatusStyleMap[GoalStatus.PENDING] = 'white';
        goalStatusStyleMap[GoalStatus.ACTIVE] = 'green';
        goalStatusStyleMap[GoalStatus.PAUSE] = 'yellow';
        goalStatusStyleMap[GoalStatus.SUCCESS] = 'blue';
        goalStatusStyleMap[GoalStatus.FAIL] = 'orange';
        goalStatusStyleMap[GoalStatus.ERROR] = 'red';

        goalStatusColorsMap[GoalStatus.PENDING] = ['#0859F1', '#0200D9'];
        goalStatusColorsMap[GoalStatus.ACTIVE] = ['#0859F1', '#0200D9'];
        goalStatusColorsMap[GoalStatus.PAUSE] = ['#069A6E', '#00767D'];
        goalStatusColorsMap[GoalStatus.SUCCESS] = ['#069A6E', '#00767D'];
        goalStatusColorsMap[GoalStatus.FAIL] = ['#EE5600', '#CE004A'];
        goalStatusColorsMap[GoalStatus.ERROR] = ['#EE5600', '#CE004A'];
    }

    function getImagePart1(uint256 tokenId, NftMetadataCreateParams memory nftParams) private view returns (string memory) {
        return string(abi.encodePacked(
            '<path d="M0 20C0 8.95431 8.9543 0 20 0H248C259.046 0 268 8.95431 268 20V366C268 377.046 259.046 386 248 386H20C8.9543 386 0 377.046 0 366V20Z" fill="#20234A" />',
            '<mask id="mask0_2808_4707" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="268" height="386">',
            '<path d="M0 20C0 8.95431 8.9543 0 20 0H248C259.046 0 268 8.95431 268 20V366C268 377.046 259.046 386 248 386H20C8.9543 386 0 377.046 0 366V20Z" fill="#1D1F36" />',
            '</mask>',
            '<g mask="url(#mask0_2808_4707)">',
            '<circle cx="78" cy="247" r="257" fill="url(#paint0_linear_2808_4707)" />',
            '<circle cx="171.5" cy="280.5" r="176.5" fill="url(#paint1_linear_2808_4707)" />',
            '<circle cx="248.5" cy="387.5" r="176.5" fill="url(#paint2_linear_2808_4707)" />',
            '<circle cx="253.5" cy="468.5" r="109.5" fill="url(#paint3_linear_2808_4707)" />',
            '</g>',
            '<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Montserrat" font-size="40" font-weight="300" letter-spacing="0em">',
            '<tspan x="24" y="60.34">Goal NFT #', Strings.toString(tokenId), '</tspan>',
            '</text>'
        ));
    }

    function getImagePart2(NftMetadataCreateParams memory nftParams) private view returns (string memory) {
        return string(abi.encodePacked(
            '<path d="M24 119.333C24 100.924 38.9238 86 57.3333 86H170.333C174.015 86 177 88.9848 177 92.6667C177 111.076 162.076 126 143.667 126H30.6667C26.9848 126 24 123.015 24 119.333Z" fill="white"/>',
            '<text fill="', goalStatusColorsMap[nftParams.status][0] ,'" xml:space="preserve" style="white-space: pre" font-family="Montserrat" font-size="22" font-style="italic" font-weight="bold" letter-spacing="0em">',
            '<tspan x="47" y="113.887">', goalStatusTitleMap[nftParams.status], '</tspan>',
            '</text>',
            '<line x1="24" y1="179.5" x2="244" y2="179.5" stroke="white" />',
            '<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Montserrat" font-size="16" font-weight="bold" letter-spacing="0em">',
            '<tspan x="24" y="223.736">Steps per day: ',Strings.toString(nftParams.dailyStepsCount),'</tspan>',
            '</text>'
        ));
    }

    function getImagePart3(NftMetadataCreateParams memory nftParams) private view returns (string memory) {
        return string(abi.encodePacked(
            '<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Montserrat" font-size="16" font-weight="bold" letter-spacing="0em">',
            '<tspan x="24" y="265.736">Failed days count: ',Strings.toString(nftParams.failDaysCount),'</tspan>',
            '</text>',
            '<line x1="24" y1="297.5" x2="244" y2="297.5" stroke="white" />',
            '<text fill="white" xml:space="preserve" style="white-space: pre" font-family="Montserrat" font-size="16" font-weight="bold" letter-spacing="0em">',
            '<tspan x="24" y="341.736">Bet: ',Strings.toString(nftParams.betAmount / 1 ether),' LINK</tspan>',
            '</text>'
        ));
    }

    function getImagePart4(NftMetadataCreateParams memory nftParams) private view returns (string memory) {
        return string(abi.encodePacked(
            DEFS_START,
            '<linearGradient id="paint0_linear_2808_4707" x1="12.5626" y1="1.08214" x2="78.728" y2="150.898" gradientUnits="userSpaceOnUse">',
            '<stop stop-color="', goalStatusColorsMap[nftParams.status][0], '" />',
            '<stop offset="1" stop-color="', goalStatusColorsMap[nftParams.status][1], '" />',
            '</linearGradient>',
            '<linearGradient id="paint1_linear_2808_4707" x1="126.56" y1="111.611" x2="172" y2="214.5" gradientUnits="userSpaceOnUse">',
            '<stop stop-color="', goalStatusColorsMap[nftParams.status][0], '" />',
            '<stop offset="1" stop-color="', goalStatusColorsMap[nftParams.status][1], '" />',
            '</linearGradient>'
        ));
    }

    function getImagePart5(NftMetadataCreateParams memory nftParams) private view returns (string memory) {
        return string(abi.encodePacked(
            '<linearGradient id="paint2_linear_2808_4707" x1="203.56" y1="218.611" x2="249" y2="321.5" gradientUnits="userSpaceOnUse">',
            '<stop stop-color="', goalStatusColorsMap[nftParams.status][0], '" />',
            '<stop offset="1" stop-color="', goalStatusColorsMap[nftParams.status][1], '" />',
            '</linearGradient>',
            '<linearGradient id="paint3_linear_2808_4707" x1="225.619" y1="363.722" x2="253.81" y2="427.554" gradientUnits="userSpaceOnUse">',
            '<stop stop-color="', goalStatusColorsMap[nftParams.status][0], '" />',
            '<stop offset="1" stop-color="', goalStatusColorsMap[nftParams.status][1], '" />',
            '</linearGradient>',
            DEFS_END
        ));
    }

    function createImage(uint256 tokenId, NftMetadataCreateParams memory nftParams) private view returns (string memory) {
        // string memory part1 = getImagePart1(nftParams);
        // string memory part2 = getImagePart2(tokenId, nftParams);
        // string memory part3 = getImagePart3(nftParams);
        // string memory part4 = getImagePart4(nftParams);
        // string memory part5 = getImagePart5(nftParams);

        return string(abi.encodePacked('data:image/svg+xml;base64,', Base64.encode(bytes(string(abi.encodePacked(
            SVG_START,
            // part1,
            // part2,
            // part3,
            // part4,
            getImagePart1(tokenId, nftParams),
            getImagePart2(nftParams),
            getImagePart3(nftParams),
            getImagePart4(nftParams),
            getImagePart5(nftParams),
            SVG_END
        ))))));
    }

    function setNftMedata(uint256 tokenId, NftMetadataCreateParams memory nftMetadata) private {
        _setValue(tokenId, key_token_name, abi.encode(abi.encodePacked("Goal NFT #", Strings.toString(tokenId))));

        _setValue(tokenId, key_token_description, abi.encode("Steps Hunter is ...."));

        string memory image = createImage(tokenId, nftMetadata);
        _setValue(tokenId, key_token_image, abi.encode(image));

        bytes[] memory trait_types = new bytes[](7);
        bytes[] memory trait_values = new bytes[](7);
        bytes[] memory trait_displays = new bytes[](7);

        trait_types[goal_attribute_status_trait_index] = abi.encode(goal_attribute_status_trait_type);
        trait_values[goal_attribute_status_trait_index] = abi.encode(goalStatusTitleMap[nftMetadata.status]);
        trait_displays[goal_attribute_status_trait_index] = abi.encode("");

        trait_types[goal_attribute_duration_days_count_trait_index] = abi.encode(goal_attribute_duration_days_count_trait_type);
        trait_values[goal_attribute_duration_days_count_trait_index] = abi.encode(Strings.toString(nftMetadata.durationDaysCount));
        trait_displays[goal_attribute_duration_days_count_trait_index] = abi.encode("");

        trait_types[goal_attribute_day_records_count_trait_index] = abi.encode(goal_attribute_day_records_count_trait_type);
        trait_values[goal_attribute_day_records_count_trait_index] = abi.encode(Strings.toString(nftMetadata.dayRecordsCount));
        trait_displays[goal_attribute_day_records_count_trait_index] = abi.encode("");

        trait_types[goal_attribute_max_fail_days_count_trait_index] = abi.encode(goal_attribute_max_fail_days_count_trait_type);
        trait_values[goal_attribute_max_fail_days_count_trait_index] = abi.encode(Strings.toString(nftMetadata.maxFailDaysCount));
        trait_displays[goal_attribute_max_fail_days_count_trait_index] = abi.encode("");

        trait_types[goal_attribute_fail_days_count_trait_index] = abi.encode(goal_attribute_fail_days_count_trait_type);
        trait_values[goal_attribute_fail_days_count_trait_index] = abi.encode(Strings.toString(nftMetadata.failDaysCount));
        trait_displays[goal_attribute_fail_days_count_trait_index] = abi.encode("");

        trait_types[goal_attribute_daily_steps_count_trait_index] = abi.encode(goal_attribute_daily_steps_count_trait_type);
        trait_values[goal_attribute_daily_steps_count_trait_index] = abi.encode(Strings.toString(nftMetadata.dailyStepsCount));
        trait_displays[goal_attribute_daily_steps_count_trait_index] = abi.encode("");

        trait_types[goal_attribute_bet_amount_trait_index] = abi.encode(goal_attribute_bet_amount_trait_type);
        trait_values[goal_attribute_bet_amount_trait_index] = abi.encode(Strings.toString(nftMetadata.betAmount));
        trait_displays[goal_attribute_bet_amount_trait_index] = abi.encode("");

        _setValues(tokenId, key_token_attributes_trait_type, trait_types);
        _setValues(tokenId, key_token_attributes_trait_value, trait_values);
        _setValues(tokenId, key_token_attributes_display_type, trait_displays);
    }

    function mintNft(address to, uint256 tokenId, NftMetadataCreateParams memory nftMetadata) external onlyOwner {
        setNftMedata(tokenId, nftMetadata);
        _safeMint(to, tokenId, ""); 
    }

    function updateNft(uint256 tokenId, NftMetadataCreateParams memory nftMetadata) external onlyOwner {
        _requireMinted(tokenId);

        setNftMedata(tokenId, nftMetadata);

        emit MetadataUpdate(tokenId);
    }
}