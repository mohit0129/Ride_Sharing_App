import { Colors } from "@/utils/Constants";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    footerContainer: {
        backgroundColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: '#000',
        elevation: 10,
        padding: 15
    },
    addressText: {
        fontSize: RFValue(12),
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 55,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        paddingVertical: 10,
        // borderBottomWidth: 1,
        marginVertical:10,
        borderTopWidth: 1,
        borderColor: "#ccc"
    },
    buttonText: {
        color: '#fff',
        fontSize: RFValue(13),
    },
    centerText: {
        textAlign: 'center',
        fontWeight: "600",
        marginTop: 15,
        fontSize: RFValue(13),
        textTransform: 'capitalize',
        fontFamily : 'Bold'
    },
    cancelButton: {
        color: Colors.iosColor,
        fontSize: RFValue(13),
        position: "absolute",
        top: -18,
        zIndex: 99,
        right: 14
    },
    searchContainer: {
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        margin: 15,
        justifyContent: "space-between",
        borderRadius: 46,
        paddingVertical: 5,
    },
    input: {
        backgroundColor: '#f2f2f2',
        width: '92%',
        height: 42,
        fontFamily : 'Regular'
    }
})