import { Colors, screenWidth } from "@/utils/Constants";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const uiStyles = StyleSheet.create({
    absoluteTop: {
        zIndex: 1,
        position: "absolute",
        top: 0
    },
    container: {
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: 15,
        overflow: "hidden",
        paddingVertical: 10,
        justifyContent: 'space-between',
        gap : 12,
        width : '100%'
    },
    btn: {
        backgroundColor: Colors.background,
        borderRadius: 100,
        justifyContent: 'center',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: '#000',
        elevation: 10,
        alignItems: 'center',
        padding: 10
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: "#62cf23",
        borderRadius: 100,
        marginHorizontal: 10
    },
    locationBar: {
        width: '70%',
        backgroundColor: "white",
        borderRadius: 100,
        height: 48,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: '#000',
        elevation: 10,
        gap: 1,
        alignItems: 'center',
        flexDirection: 'row',

    },
    locationText: {
        width: '86%',
        fontSize: RFValue(12),
        fontFamily: 'Regular',
        color: Colors.text,
        opacity: 0.8
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: 10,
        marginBottom: 20,
        padding: 14,
        backgroundColor: Colors.secondary_light
    },
    cubeContainer: {
        width: '22.8%',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cubeIcon: {
        width: '100%',
        height: 45,
        aspectRatio: 1 / 1,
        resizeMode: "contain",
    },
    cubeIconContainer: {
        width: '100%',
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        height: 60,
        marginBottom: 10,
        backgroundColor: '#E5E7EA'
    },
    cubes: {
        flexDirection: 'row',
        height: 100,
        marginVertical: 20,
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    adImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    adSection: {
        width: '100%',
        backgroundColor: '#E5E7EA',
        marginVertical: 10,
        height: 140,
        borderRadius : 12,
        overflow : 'hidden'
    },
    banner: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius : 16,
    },
    bannerContainer: {
        width: '100%',
        // height: screenWidth,
        aspectRatio : 1,
        marginBottom: 30,
        borderRadius : 16,
        overflow : 'hidden',
        marginTop : 20
    },
    locationInputs: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    suggestionText: {
        marginTop: 6,
        color: '#666',
        textTransform: 'capitalize'
    },
    mapPinIcon: {
        width: 20,
        marginRight: 10,
        height: 20,
        resizeMode: 'contain'
    },
    mapPinIconContainer : {
        backgroundColor : '#f2f2f2',
        borderRadius : 30,
        padding : 14,
        width: 30,
        height: 30,
        justifyContent : 'center',
        alignItems : 'center',
        marginRight: 10,
        borderWidth : 1,
        borderColor : 'rgba(205, 205, 205, 0.45)',
    },
    footerBtn : {
        padding : 10,
        backgroundColor : Colors.primary,
        borderRadius : 16,
        marginBottom : 14
    },
    footerBtnTxt : {
        color : '#fff',
    }
})