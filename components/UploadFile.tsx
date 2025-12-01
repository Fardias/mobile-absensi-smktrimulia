import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const ExpoFileUploadComponent = ({ onSelect }: { onSelect?: (asset: DocumentPicker.DocumentPickerAsset | null) => void }) => {
    const [fileResponse, setFileResponse] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [loading, setLoading] = useState(false);

    const selectFile = async () => {
        // Menggunakan API Expo untuk memilih satu dokumen
        let result = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf"],
            copyToCacheDirectory: true,
        });

        // Periksa status hasil pemilihan (success atau cancel)
        if (result.canceled === false && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            setFileResponse(asset);
            onSelect?.(asset);
        } else {
            setFileResponse(null);
            onSelect?.(null);
            console.log('User cancelled the file picker or no file selected.');
        }
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.primaryBtn} onPress={selectFile}>
                    <Text style={styles.primaryBtnText}>{fileResponse ? 'Ganti File' : 'Pilih File'}</Text>
                </TouchableOpacity>
                {loading && <ActivityIndicator size="small" color="#4A90E2" />}
            </View>

            {fileResponse && (
                <View style={styles.card}>
                    <Text style={styles.label}>File dipilih</Text>
                    <Text style={styles.value}>{fileResponse.name}</Text>
                </View>
            )}
        </View>
    );
}

export default ExpoFileUploadComponent;

const styles = StyleSheet.create({
    container: {
        // padding: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    primaryBtn: {
        backgroundColor: '#4A90E2',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    value: {
        fontSize: 16,
        color: '#001933',
        fontWeight: '700',
        marginTop: 6,
    },
});
