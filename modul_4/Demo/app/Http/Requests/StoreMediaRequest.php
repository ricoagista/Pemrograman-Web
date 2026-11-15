<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMediaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isPatch = $this->isMethod('patch');
        $presence = $isPatch ? 'sometimes' : 'required';

        // Pada PATCH, abaikan title milik record yang sedang diupdate
        $mediaId = $this->route('media')?->id ?? $this->route('media');
        $titleUnique = Rule::unique('media', 'title');
        if ($isPatch && $mediaId) {
            $titleUnique->ignore($mediaId);
        }

        return [
            'title' => [$presence, 'string', 'max:255', $titleUnique],
            'creator' => [$presence, 'string', 'max:255'],
            'year' => [$presence, 'integer', 'min:1000', 'max:2100'],
            'aura' => ['nullable', 'string', Rule::in(['High Energy', 'Melancholy', 'Cozy'])],
            'type' => [$presence, 'string', Rule::in(['anime', 'manga'])],
        ];
    }

    /**
     * Pesan error dalam Bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul media wajib diisi.',
            'title.unique' => 'Judul media sudah terdaftar.',
            'creator.required' => 'Kreator media wajib diisi.',
            'year.required' => 'Tahun rilis media wajib diisi.',
            'year.integer' => 'Tahun rilis harus berupa angka.',
            'type.required' => 'Tipe media wajib diisi.',
            'type.in' => 'Tipe media harus berupa anime atau manga.',
            'aura.in' => 'Aura harus salah satu dari: High Energy, Melancholy, Cozy.',
        ];
    }
}
