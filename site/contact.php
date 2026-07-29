<?php
/**
 * Prominent Roofing, Memphis TN
 * Form handler for Hostinger shared hosting (PHP mail(), no dependencies).
 *
 * Set TO_EMAIL below. On Hostinger the From address must be a mailbox on your
 * own domain or the mail is dropped as spoofed, so FROM_EMAIL stays on
 * prominentroofing.shop and the visitor's address goes in Reply-To.
 */

declare(strict_types=1);

const TO_EMAIL    = 'info@prominentroofing.shop';
const FROM_EMAIL  = 'no-reply@prominentroofing.shop';   // must exist in hPanel > Emails
const FROM_NAME   = 'Prominent Roofing website';
const SUCCESS_URL = '/thank-you.html';
const FAIL_URL    = '/#inspection';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /', true, 303);
    exit;
}

/* ------------------------------------------------------------- helpers */
function field(string $key, int $max = 300): string
{
    $v = $_POST[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = trim($v);
    $v = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);   // header injection
    return mb_substr($v, 0, $max);
}

function body_field(string $key, int $max = 3000): string
{
    $v = $_POST[$key] ?? '';
    return is_string($v) ? mb_substr(trim($v), 0, $max) : '';
}

function bail(string $why): void
{
    header('Location: ' . FAIL_URL . '?sent=error', true, 303);
    error_log('[prominent-roofing] contact form rejected: ' . $why);
    exit;
}

/* ------------------------------------------------------------- spam gate */
if (field('website') !== '') {
    // honeypot filled, quietly pretend it worked
    header('Location: ' . SUCCESS_URL, true, 303);
    exit;
}

/* --------------------------------------------------------------- input */
$name    = field('name', 120);
$phone   = field('phone', 40);
$email   = field('email', 160);
$address = field('address', 200);
$city    = field('city', 100);
$service = field('service', 80);
$source  = field('form_name', 80) ?: 'Website form';
$message = body_field('message');

if ($name === '' || $phone === '' || $address === '') {
    bail('missing required field');
}
if (preg_match_all('/\d/', $phone) < 10) {
    bail('phone too short');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $email = '';
}

/* ---------------------------------------------------------------- mail */
$lines = [
    'New roof inquiry from prominentroofing.shop',
    str_repeat('=', 46),
    '',
    'Name:     ' . $name,
    'Phone:    ' . $phone,
    'Email:    ' . ($email !== '' ? $email : 'not given'),
    'Address:  ' . $address . ($city !== '' ? ', ' . $city : ''),
    'Service:  ' . ($service !== '' ? $service : 'not specified'),
    '',
    'Message:',
    $message !== '' ? $message : '(none)',
    '',
    str_repeat('-', 46),
    'Form:     ' . $source,
    'Received: ' . date('D j M Y, g:ia T'),
    'IP:       ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
];

$subject = sprintf('Roof inquiry: %s, %s', $name, $service !== '' ? $service : 'general');

$headers = [
    'From: ' . sprintf('%s <%s>', FROM_NAME, FROM_EMAIL),
    'Reply-To: ' . ($email !== '' ? sprintf('%s <%s>', $name, $email) : FROM_EMAIL),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$ok = mail(
    TO_EMAIL,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    implode("\n", $lines),
    implode("\r\n", $headers),
    '-f' . FROM_EMAIL
);

if (!$ok) {
    bail('mail() returned false');
}

header('Location: ' . SUCCESS_URL, true, 303);
exit;
